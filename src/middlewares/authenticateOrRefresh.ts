import { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/jwtUtils";
import { prisma } from "../database/prisma.client";

export async function authenticateOrRefresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded.userId) {
        req.user = { id: decoded.userId };
        next();
        return;
      }
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No valid token found" });
      return;
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        isValid: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);

    // Set new access token
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hours
      path: "/",
      ...(process.env.NODE_ENV === "production"
        ? { domain: process.env.COOKIE_DOMAIN }
        : {}),
    });

    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}
