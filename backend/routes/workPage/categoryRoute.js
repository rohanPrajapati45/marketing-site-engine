import express from "express";

const router = express.Router();

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../../controllers/workPage/categoryController.js";

router.post("/create", createCategory);
router.get("/all", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;