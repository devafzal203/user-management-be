import express from "express";
import {
  changeAvatar,
  changeName,
  changePassword,
  getUserActivities,
  getUserProfile,
} from "../controller/user.controller";
import { uploadAvatarMiddleware } from "../middlewares/uploadMiddleware";

const router = express.Router();

router.get("/activites", getUserActivities);
router.get("/profile", getUserProfile);
router.patch("/name", changeName);
router.patch("/password", changePassword);
router.patch("/avatar", uploadAvatarMiddleware, changeAvatar);

export { router };
