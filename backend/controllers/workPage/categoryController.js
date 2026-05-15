import categoryModel from "../../models/workPage/categoryModel.js";

export const createCategory = async (req, res) =>{
    try{
        const category = await categoryModel.create(req.body);
        res.status(201).json({message: "Category created successfully", category});
    }
    catch(error){
        res.status(500).json({message: "Failed to create category", error: error.message});
    }
}

export const getAllCategories = async (req, res) => {
    try{
        const categories = await categoryModel.find().populate("subcategory");
        res.status(200).json({message: "Categories fetched successfully", categories});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch categories", error: error.message});
    }
}

export const getCategoryById = async (req, res) => {
    try{
        const category = await categoryModel.findById(req.params.id).populate("subcategory");
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json({message: "Category fetched successfully", category});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch category", error: error.message});
    }
}

export const updateCategory = async (req, res) => {
    try{
        const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json({message: "Category updated successfully", category});
    }
    catch(error){
        res.status(500).json({message: "Failed to update category", error: error.message});
    }
}

export const deleteCategory = async (req, res) => {
    try{
        const category = await categoryModel.findByIdAndDelete(req.params.id);
        if(!category){
            return res.status(404).json({message: "Category not found"});
        }
        res.status(200).json({message: "Category deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: "Failed to delete category", error: error.message});
    }
}