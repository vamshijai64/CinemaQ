const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const upload=require('../middlewares/uploadMiddleware')

// Routes for subcategories
router.post('/create',  upload.single('image'),subcategoryController.createSubcategory);
router.get('/', subcategoryController.getAllSubcategories);
router.get("/:id", subcategoryController.getSubcategoryById);

router.get("/name/search", subcategoryController.searchSubcategoryByName);
router.put("/update/:id", upload.single("imageFile"),subcategoryController.updateSubcategory);
router.delete("/delete/:id", subcategoryController.deleteSubcategory);


module.exports = router;
