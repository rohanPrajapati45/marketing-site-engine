import express from "express";

const router = express.Router();

import { registerAdmin, loginAdmin, logoutAdmin } from "../../controllers/adminAuth/authController.js";
import { verifyAdmin } from "../../middleware/auth/authMiddleware.js";

router.post("/register", verifyAdmin, registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);

export default router;