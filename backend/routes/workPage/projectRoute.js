import express from "express";

const router = express.Router();

import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from "../../controllers/workPage/projectController.js";
import { optionalAdmin } from "../../middleware/auth/optionalAuthMiddleware.js";

router.post("/create", optionalAdmin, createProject);
router.get("/all", getAllProjects);
router.get("/:id", getProjectById);
router.put("/update/:id", optionalAdmin, updateProject);
router.delete("/delete/:id", optionalAdmin, deleteProject);

export default router;
