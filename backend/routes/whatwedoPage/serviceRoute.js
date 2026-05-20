import express from "express";
const router = express.Router();


import {createService, getAllServices, getServiceById, updateService, deleteService} from "../../controllers/whatwedoPage/serviceController.js";
import { optionalAdmin } from "../../middleware/auth/optionalAuthMiddleware.js";

router.post("/create", optionalAdmin, createService);
router.get("/all", getAllServices);
router.get("/:id", getServiceById);
router.put("/update/:id", optionalAdmin, updateService);
router.delete("/delete/:id", optionalAdmin, deleteService);

export default router;