import express from "express";

const router = express.Router();

import { registerAdmin, loginAdmin, logoutAdmin, forgotPassword, verifyOTP, resetPassword, sendLoginOtp, verifyLoginOtp, getMe, listAdmins, deleteAdmin } from "../../controllers/adminAuth/authController.js";
import { listActivity } from "../../controllers/adminAuth/activityController.js";
import { verifyAdmin } from "../../middleware/auth/authMiddleware.js";
import { optionalAdmin } from "../../middleware/auth/optionalAuthMiddleware.js";

router.post("/register", verifyAdmin, registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", optionalAdmin, logoutAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// OTP-based login flow
router.post("/send-login-otp", sendLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

// Auth persistence
router.get("/me", verifyAdmin, getMe);
router.get("/admins", verifyAdmin, listAdmins);
router.delete("/admins/:id", verifyAdmin, deleteAdmin);
router.get("/activity", verifyAdmin, listActivity);

export default router;