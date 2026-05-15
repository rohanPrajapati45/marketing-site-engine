import express from "express";

const router = express.Router();

import { registerAdmin, loginAdmin, logoutAdmin, forgotPassword, verifyOTP, resetPassword } from "../../controllers/adminAuth/authController.js";
import { verifyAdmin } from "../../middleware/auth/authMiddleware.js";

router.post("/register", verifyAdmin, registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;