import express from "express";
import passport from "passport";
import {
  googleCallback,
  login,
  logout,
  signup,
  refreshToken,
  getAuthStatus,
} from "../controller/auth.controller";
import { apiKeyValidator } from "../middlewares/apiKeyValidator";

const router = express.Router();

router.post("/signup", apiKeyValidator, signup);
router.post("/login", apiKeyValidator, login);
router.post("/logout", apiKeyValidator, logout);
router.post("/refresh-token", apiKeyValidator, refreshToken);
router.get("/status", apiKeyValidator, getAuthStatus);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/?error=google_auth_failed`,
    session: false,
  }),
  googleCallback
);

export { router };
