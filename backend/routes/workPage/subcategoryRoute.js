import express from "express";

const router = express.Router();

import {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} from "../../controllers/workPage/subcategoryController.js";
import { optionalAdmin } from "../../middleware/auth/optionalAuthMiddleware.js";

router.post("/create", optionalAdmin, createSubCategory);
router.get("/all", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.put("/update/:id", optionalAdmin, updateSubCategory);
router.delete("/delete/:id", optionalAdmin, deleteSubCategory);

export default router;