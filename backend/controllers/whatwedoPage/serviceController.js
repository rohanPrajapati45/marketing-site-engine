import serviceModel from "../../models/whatwedoPage/serviceModel.js";
import { logActivity } from "../../utils/activityLogger.js";

export const createService = async (req, res) =>{
    try{
        const service = await serviceModel.create(req.body);
        await logActivity(req, {
            action: "service.create",
            entityType: "service",
            entityId: service._id.toString(),
            summary: `Created service ${service.title || service._id}`,
        });
        res.status(201).json({message: "Service created successfully", service});
    }
    catch(error){
        res.status(500).json({message: "Failed to create service", error: error.message});
    }
}

export const getAllServices = async (req, res) => {
    try{
        const services = await serviceModel.find({});   
        res.status(200).json({message: "Services fetched successfully", services});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch services", error: error.message});
    }
}

export const getServiceById = async (req, res) => {
    try{
        const service = await serviceModel.findById(req.params.id);
        if(!service){
            return res.status(404).json({message: "Service not found"});
        }
        res.status(200).json({message: "Service fetched successfully", service});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch service", error: error.message});
    }
}

export const updateService = async (req, res) => {
    try{
        const service = await serviceModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!service){
            return res.status(404).json({message: "Service not found"});
        }   
        await logActivity(req, {
            action: "service.update",
            entityType: "service",
            entityId: service._id.toString(),
            summary: `Updated service ${service.title || service._id}`,
        });
        res.status(200).json({message: "Service updated successfully", service});
    }
    catch(error){
        res.status(500).json({message: "Failed to update service", error: error.message});
    }
}

export const deleteService = async (req, res) => {
    try{
        const service = await serviceModel.findByIdAndDelete(req.params.id);
        if(!service){
            return res.status(404).json({message: "Service not found"});
        }
        await logActivity(req, {
            action: "service.delete",
            entityType: "service",
            entityId: service._id.toString(),
            summary: `Deleted service ${service.title || service._id}`,
        });
        res.status(200).json({message: "Service deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: "Failed to delete service", error: error.message});
    }
}