const CategeoryModel = require('../models/CategeoryModel');
const subcategoryService = require('../services/subcategoryService');

exports.createSubcategory = async (req, res) => {
  try {
    const { name,category} = req.body;
    const imageFile = req.file ? `/uploads/${req.file.filename}` : null; // Local system upload
   // const image = imageFile || imageUrl;


  // Ensure at least one image source is provided
  if (!imageFile) {
    return res.status(400).json({ message: "Image is required (upload or provide a URL)" });
  }
  const image = imageFile ;


    const subcategory = await subcategoryService.createSubcategory(name,image, category);
    res.status(201).json({ message: 'Subcategory created successfully', subcategory });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Error creating subcategory', error: error.message });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await subcategoryService.getAllSubcategories();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};
//  Get subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await subcategoryService.getSubcategoryById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategory", error: error.message });
  }
};


//  Search subcategory by name (Case-Insensitive)
exports.searchSubcategoryByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Search query is required" });
    }
    console.log(`🔍 Searching subcategory for: ${name}`);

    const subcategory = await subcategoryService.searchSubcategoryByName(name);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    
    res.status(200).json(subcategory);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error searching subcategory", error: error.message });
  }
};


//  Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { name,imageUrl } = req.body;
    const imageFile = req.file;

    console.log("🔹 Received Name:", name);
    console.log("🔹 Received Image File:", imageFile);  // Debugging
    console.log("🔹 Received Image URL:", imageUrl);
    const subcategoryId = req.params.id;
    if (!imageFile && !imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = imageFile ? `/uploads/${imageFile.filename}` : imageUrl ;

    if(!image){
      return res.status(400).json({message:"Image is required"});
    }


    const updatedSubcategory = await subcategoryService.updateSubcategory(subcategoryId, name, image);

    res.status(200).json({message:"Subcategory updated successfully",updatedSubcategory});
  } catch (error) {
    //console.log(error);
    console.error("🔥 Error updating subcategory:", error.message);
    
    res.status(400).json({message: "Error updating subcategory",  message: error.message });
    
  }
};


// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    await subcategoryService.deleteSubcategory(req.params.id);
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error: error.message });
  }
};