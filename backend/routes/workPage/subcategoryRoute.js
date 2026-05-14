import express from "express";

const router = express.Router();

import {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
} from "../../controllers/workPage/subcategoryController.js";

router.post("/create", createSubCategory);
router.get("/all", getAllSubCategories);
router.get("/:id", getSubCategoryById);
router.put("/update/:id", updateSubCategory);
router.delete("/delete/:id", deleteSubCategory);

export default router;