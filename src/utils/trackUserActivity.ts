import { ActivityDetails, ActivityType } from "../types";
import { prisma } from "../database/prisma.client";

export async function trackUserActivity(
  userId: string,
  activityType: ActivityType,
  ipAddress: string,
  details?: ActivityDetails
) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        activityType,
        ipAddress,
        details: details || {},
      },
    });
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
}
