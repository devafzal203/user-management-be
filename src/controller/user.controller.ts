import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { prisma } from "../database/prisma.client";
import { trackUserActivity } from "../utils/trackUserActivity";

export async function getUserActivities(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const activities = await prisma?.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const user = await prisma?.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        id: true,
        avatarUrl: true,
        provider: true,
      },
    });

    const data: any = await fetch("https://ip.guide/").then((res) =>
      res.json()
    );

    const address = [
      { header: "Country", item: data.location.country },
      { header: "City/State", item: data.location.city },
      { header: "Timezone", item: data.location.timezone },
      {
        header: "Organization",
        item: data.network.autonomous_system.organization,
      },
    ];

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({
      ...user,
      address,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { newPassword } = req.body;
    const userId = (req.user as any).id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!newPassword || typeof newPassword !== "string") {
      res.status(400).json({ message: "Invalid password provided" });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    const { ip }: any = await fetch("https://api.ipify.org/?format=json").then(
      (res) => res.json()
    );

    // Track activity
    await trackUserActivity(userId, "PASSWORD_CHANGE", ip || req.ip!);

    // Invalidate all refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isValid: false },
    });

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
}

export async function changeName(req: Request, res: Response) {
  try {
    const { newName } = req.body;
    const userId = (req.user as any).id;

    console.log({ userId });

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!newName || typeof newName !== "string") {
      res.status(400).json({ message: "Invalid name provided" });
      return;
    }

    // Update user name in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: newName.trim(),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    const { ip }: any = await fetch("https://api.ipify.org/?format=json").then(
      (res) => res.json()
    );

    // Track activity
    await trackUserActivity(userId, "NAME_UPDATE", ip || req.ip!, {
      newName: newName.trim(),
    });

    res.status(200).json({
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Name update error:", error);
    res.status(500).json({ message: "Failed to update name" });
  }
}

export async function changeAvatar(req: Request, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const userId = (req.user as any).id;

    console.log("userId", userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: req.file.path, // Cloudinary URL
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    const { ip }: any = await fetch("https://api.ipify.org/?format=json").then(
      (res) => res.json()
    );

    await trackUserActivity(userId, "AVATAR_UPDATE", ip || req.ip!, {
      avatarUrl: req.file.path,
    });

    res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({ message: "Failed to update avatar" });
  }
}
