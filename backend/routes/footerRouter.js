import express from "express";
import { verifyAdmin } from "../middleware/auth/authMiddleware.js";
import {
  getFooterSettings,
  updateCopyright,
  addSocialLink,
  reorderSocialLinks,
  updateSocialLink,
  deleteSocialLink,
} from "../controllers/footerController.js";

const footerRouter = express.Router();

// Public
footerRouter.get("/", getFooterSettings);

// Admin-protected routes
footerRouter.put("/copyright", verifyAdmin, updateCopyright);
footerRouter.post("/social", verifyAdmin, addSocialLink);
footerRouter.put("/social/reorder", verifyAdmin, reorderSocialLinks);
footerRouter.put("/social/:id", verifyAdmin, updateSocialLink);
footerRouter.delete("/social/:id", verifyAdmin, deleteSocialLink);

export default footerRouter;
