import { Request, Response, NextFunction } from "express";

export async function apiKeyValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    res.status(401).json({ message: "forbidden" });
    return;
  }

  if (apiKey !== process.env.X_API_KEY) {
    res.status(400).json({ message: "Invalid API Key" });
    return;
  }

  next();
}
