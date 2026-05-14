import express from "express";

const router = express.Router();

import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} from "../../controllers/workPage/projectController.js";

router.post("/create", createProject);
router.get("/all", getAllProjects);
router.get("/:id", getProjectById);
router.put("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

export default router;
