import subcategoryModel from "../../models/workPage/subcategoryModel.js";
import categoryModel from "../../models/workPage/categoryModel.js";

export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({
        message: "name and category are required",
      });
    }
    const categoryExists = await categoryModel.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    const subcategory = await subcategoryModel.create({
      name,
      category,
    });
    console.log("SubCategory Created:", subcategory.name);
    return res.status(201).json({
      message: "SubCategory created successfully",
      subcategory,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to create subcategory",
      error: error.message,
    });
  }
};

export const getAllSubCategories = async (req, res) => {
    try{
        const subcategories = await subcategoryModel.find({}).populate("category");
        res.status(200).json({message: "SubCategories fetched successfully", subcategories});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch subcategories", error: error.message});
    }
}

export const getSubCategoryById = async (req, res) => {
    try{
        const subcategory = await subcategoryModel.findById(req.params.id).populate("category");
        if(!subcategory){
            return res.status(404).json({message: "SubCategory not found"});
        }
        res.status(200).json({message: "SubCategory fetched successfully", subcategory});
    }
    catch(error){
        res.status(500).json({message: "Failed to fetch subcategory", error: error.message});
    }
}

export const updateSubCategory = async (req, res) => {
    try{
        const subcategory = await subcategoryModel.findByIdAndUpdate(req.params.id, req.body
                                                                        , {new: true});
        if(!subcategory){
            return res.status(404).json({message: "SubCategory not found"});
        }
        res.status(200).json({message: "SubCategory updated successfully", subcategory});
    }
    catch(error){
        res.status(500).json({message: "Failed to update subcategory", error: error.message});
    }
}

export const deleteSubCategory = async (req, res) => {
    try{
        const subcategory = await subcategoryModel.findByIdAndDelete(req.params.id);
        if(!subcategory){
            return res.status(404).json({message: "SubCategory not found"});
        }
        res.status(200).json({message: "SubCategory deleted successfully"});
    }
    catch(error){
        res.status(500).json({message: "Failed to delete subcategory", error: error.message});
    }
}
