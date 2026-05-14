import express from "express";
const router = express.Router();


import {createService, getAllServices, getServiceById, updateService, deleteService} from "../../controllers/whatwedoPage/serviceController.js";

router.post("/create", createService);
router.get("/all", getAllServices);
router.get("/:id", getServiceById);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

export default router;