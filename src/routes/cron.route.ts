import { Router, Request, Response } from "express";
import { prisma } from "../database/prisma.client";
import { logger } from "../utils/logger";

const router = Router();

router.post("/clear-tokens", async (req: Request, res: Response) => {
  // Verify cron secret
  const cronSecret = req.headers["x-cron-secret"];
  if (cronSecret !== process.env.CRON_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isValid: false }],
      },
    });

    let clearedAt = new Date().toISOString();

    console.log(`Cleared ${result.count} expired tokens at ${clearedAt}`);

    logger.info("Token cleanup completed", {
      clearedTokens: result.count,
      timestamp: clearedAt,
    });

    res.json({
      success: true,
      clearedTokens: result.count,
      timestamp: clearedAt,
    });
  } catch (error) {
    console.error("Token cleanup failed:", error);
    res.status(500).json({
      error: "Token cleanup failed",
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as cronRouter };
