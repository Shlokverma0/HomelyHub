import express from "express";

import {
  check,
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updateMe,
  updatePassword,
} from "../controllers/authController.js";


const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updateMe").patch(protect, updateMe);
router.route("/updateMyPassword").patch(protect, updatePassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/me").get(protect, check);


export { router };
