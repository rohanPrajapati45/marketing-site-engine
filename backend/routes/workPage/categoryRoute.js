import express from "express";

const router = express.Router();

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../../controllers/workPage/categoryController.js";
import { optionalAdmin } from "../../middleware/auth/optionalAuthMiddleware.js";

router.post("/create", optionalAdmin, createCategory);
router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/update/:id", optionalAdmin, updateCategory);
router.delete("/delete/:id", optionalAdmin, deleteCategory);

export default router;