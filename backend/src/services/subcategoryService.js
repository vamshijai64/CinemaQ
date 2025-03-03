
const fs = require("fs");
const path = require("path");
const CategeoryModel = require('../models/CategeoryModel');
const subcategoryModel = require('../models/subcategoryModel')
const quizModel=require('../models/QuizModel')
// const questionModel=require('../models/questionModel')


exports.createSubcategory = async (name, imageFile,category) => {


  try {
   
    const normalizedName = name.trim().toLowerCase();

     // Check if subcategory already exists (case-insensitive)
     const existingSubcategory = await subcategoryModel.findOne({ name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } });
     if (existingSubcategory) {
       throw new Error('Subcategory with this name already exists');
     }

   
    // const existingSubcategory = await subcategoryModel.findOne({ name: normalizedName });
    // if (existingSubcategory) {
    //     throw new Error('Subcategory with this name already exists');
    // }

   
    const categoryDoc = await CategeoryModel.findById(category);
    if (!categoryDoc) {
        throw new Error('Category not found');
    }

    //  Create and Save Subcategory
   
    const subcategory = new subcategoryModel({ 
      name: normalizedName, 
      image: imageFile,
      category: categoryDoc._id 
  });
    const savedSubcategory = await subcategory.save();

    
    categoryDoc.subcategories.push(savedSubcategory._id);
    await categoryDoc.save();

    return savedSubcategory;
} catch (error) {
    throw new Error('Error creating subcategory: ' + error.message);
}
};

exports.getAllSubcategories = async () => {
  try {
    return await subcategoryModel.find()
    .populate('category')
    .populate('quizzes')  
    .populate({
      path: "quizzes",
      select: "title subcategory category questions createdAt updatedAt",
      populate: {
          path: "questions", // Populate questions inside quizzes
          select: "question options image correctOption hints hashtags" // Select required fields
      }    }).lean()
  } catch (error) {
    throw new Error('Error fetching subcategories: ' + error.message);
  }
};

//  Get Subcategory by ID
exports.getSubcategoryById = async (id) => {
  try {
    return await subcategoryModel.findById(id).populate("category").populate("quizzes");
  } catch (error) {
    throw new Error("Error fetching subcategory by ID: " + error.message);
  }
};


// Search Subcategory by Name (Case-Insensitive)
exports.searchSubcategoryByName = async (name) => {
  try {
    return await subcategoryModel.findOne({  name: { $regex: name, $options: "i" }, // "i" makes it case-insensitive
    }).populate("category").populate("quizzes");

  } catch (error) {
    throw new Error("Error searching subcategory: " + error.message);
  }
};


//  Update Subcategory
exports.updateSubcategory = async (subcategoryId, name, image) => {
  try {
    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    let updateData = {};

    // Update name if provided
    // if (name) {
    //   subcategory.name = name;
    // }

    if (name && name !== subcategory.name) { 
      updateData.name = name;  // ✅ Update name only if changed
    }
   // ✅ Debugging Logs
   console.log("🔹 Existing Image:", subcategory.image);
   console.log("🔹 New Image:", image);
    // Update image if provided
    // if (imageFile) {
    //   if (subcategory.image) {
    //     const oldImagePath = path.join(__dirname, "..", subcategory.image);
    //     if (fs.existsSync(oldImagePath)) {
    //       fs.unlinkSync(oldImagePath);
    //     }
    //   }
    //   subcategory.image = `/uploads/${imageFile.filename}`;
    // }

     // ✅ Handle image update
     if (image && image !== subcategory.image) {
      // Delete old local image if it's a file path (not an external URL)
      if (subcategory.image && !subcategory.image.startsWith("http")) {
        const oldImagePath = path.join(__dirname, "..", subcategory.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.image = image; // Set new image (either local or external)
    }
     // ✅ Ensure at least one field is being updated
    //  if (Object.keys(updateData).length === 0) {
    //   throw new Error("No updates provided");
    // }

 
    const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
      subcategoryId,
      { $set: updateData },
      { new: true } // ✅ Return updated document
    );
 
    return updatedSubcategory;
  } catch (error) {
    throw new Error("Error updating subcategory: " + error.message);
  }
};


//  Delete Subcategory
exports.deleteSubcategory = async (subcategoryId) => {
  try {
    console.log(" Received Subcategory ID for deletion:", subcategoryId);

    const subcategory = await subcategoryModel.findById(subcategoryId);
    if (!subcategory) throw new Error("Subcategory not found");

    console.log("Subcategory found. ID:", subcategoryId);

    //  Remove subcategory reference from its category
    console.log(" Removing subcategory reference from category...");
    await CategeoryModel.findByIdAndUpdate(subcategory.category, {
      $pull: { subcategories: subcategoryId },
    });
    console.log(" Subcategory removed from category.");

    //  Delete related quizzes
    console.log("🔍 Checking related quizzes...");
    const quizzes = await quizModel.find({ subcategory: subcategoryId });

    if (quizzes.length > 0) {
      console.log(" Found", quizzes.length, "quizzes. Deleting them...");
      await quizModel.deleteMany({ subcategory: subcategoryId });
      console.log(" All quizzes deleted.");
    }

    //  Delete image if exists
    if (subcategory.image) {
      const imagePath = path.join(__dirname, "..", subcategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Subcategory image deleted.");
      }
    }

    //  Delete subcategory itself
    await subcategoryModel.findByIdAndDelete(subcategoryId);
    console.log(" Subcategory deleted successfully.");

    return { message: "Subcategory and related quizzes deleted successfully" };
  } catch (error) {
    console.error(" Error deleting subcategory:", error.message);
    throw new Error("Error deleting subcategory: " + error.message);
  }
};