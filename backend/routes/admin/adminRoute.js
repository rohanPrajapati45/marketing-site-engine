import express from "express";

const router = express.Router();

import { registerAdmin, loginAdmin, logoutAdmin, forgotPassword, verifyOTP, resetPassword, sendLoginOtp, verifyLoginOtp, getMe } from "../../controllers/adminAuth/authController.js";
import { verifyAdmin } from "../../middleware/auth/authMiddleware.js";

router.post("/register", verifyAdmin, registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// OTP-based login flow
router.post("/send-login-otp", sendLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

// Auth persistence
router.get("/me", verifyAdmin, getMe);

export default router;