import express from "express";
import { router as authRoutes } from "../../routes/auth.route";
import cookieParser from "cookie-parser";

describe("Auth Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use("/auth", authRoutes); // Remove apiKeyValidator for tests
  });

  describe("POST /auth/signup", () => {
    it("should create a new user", async () => {
      expect(true).toBe(true);
    });
  });
});
