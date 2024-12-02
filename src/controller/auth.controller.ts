import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import { prisma } from "../database/prisma.client";
import { trackUserActivity } from "../utils/trackUserActivity";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma?.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma?.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: name,
        provider: "local",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        provider: true,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    await trackUserActivity(user.id, "SIGN_UP", req.ip!, {
      email: user.email,
      provider: "local",
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", async (err: any, user: any, info: any) => {
    try {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed",
          error: info?.message,
        });
      }

      await trackUserActivity(user.id, "LOGIN", req.ip!, {
        provider: "local",
      });

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Return user data without sensitive information
      const userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      };

      return res.status(200).json({
        message: "Logged in successfully",
        user: userData,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not provided" });
      return;
    }

    // Verify token exists and is valid in database
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        isValid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    // Verify JWT
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Invalidate old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isValid: false },
      }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: decoded.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.status(200).json({
      message: "Tokens refreshed successfully",
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isValid: false },
    });

    await trackUserActivity(decoded.userId, "LOGOUT", req.ip!);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
}

export async function googleCallback(req: Request, res: Response) {
  try {
    const user = req.user as any;

    await trackUserActivity(user.id, "AUTH_WITH_GOOGLE", req.ip!, {
      provider: "google",
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Redirect to frontend with tokens as URL parameters
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.searchParams.append("accessToken", accessToken);
    redirectUrl.searchParams.append("refreshToken", refreshToken);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
}

export async function getAuthStatus(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        authenticated: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        authenticated: false,
        message: "Not authenticated",
      });
      return;
    }

    // Token verification should be handled by middleware
    // Here we just return the user status
    res.status(200).json({
      authenticated: true,
      message: "Authenticated",
    });
  } catch (error) {
    console.error("Auth status error:", error);
    res.status(500).json({
      authenticated: false,
      message: "Internal server error",
    });
  }
}
