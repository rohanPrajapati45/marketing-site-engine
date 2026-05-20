import projectModel from "../../models/workPage/projectModel.js";
import { logActivity } from "../../utils/activityLogger.js";

export const createProject = async (req, res) =>{
    try{
        const project = await projectModel.create(req.body);
        await logActivity(req, {
            action: "work.project.create",
            entityType: "workProject",
            entityId: project._id.toString(),
            summary: `Created project ${project.title || project._id}`,
        });
        res.status(201).json({message: "Project created successfully", project});
    }
    catch(error){
        res.status(500).json({message: "Failed to create project", error: error.message});
    }
}

export const getAllProjects = async (req, res) => {
    try{
        const projects = await projectModel.find({}).populate("subcategories");   
        res.status(200).json({message: "Projects fetched successfully", projects});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch projects", error: error.message});
    }
}

export const getProjectById = async (req, res) => {
    try{
        const project = await projectModel.findById(req.params.id).populate("subcategories");   
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        res.status(200).json({message: "Project fetched successfully", project});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch project", error: error.message});
    }
}

export const updateProject = async (req, res) => {
    try{
        const project = await projectModel.findByIdAndUpdate
        (req.params.id, req.body, {new: true}).populate("subcategories");
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        await logActivity(req, {
            action: "work.project.update",
            entityType: "workProject",
            entityId: project._id.toString(),
            summary: `Updated project ${project.title || project._id}`,
        });
        res.status(200).json({message: "Project updated successfully", project});
    }
    catch(error){
        res.status(500).json({message: "Failed to update project", error: error.message});
    }
}

export const deleteProject = async (req, res) => {
    try{
        const project = await projectModel.findByIdAndDelete(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        await logActivity(req, {
            action: "work.project.delete",
            entityType: "workProject",
            entityId: project._id.toString(),
            summary: `Deleted project ${project.title || project._id}`,
        });
        res.status(200).json({message: "Project deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: "Failed to delete project", error: error.message});
    }
}
