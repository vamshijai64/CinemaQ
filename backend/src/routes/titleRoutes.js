const express = require('express');
const router = express.Router();
const TitleController = require('../controllers/titleController');
const adminAuth = require('../middlewares/adminAuthMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// For admin
router.post('/addTitle', adminAuth, upload.single('imageUrl'), TitleController.addTitle);


router.get('/getTitle/:id', TitleController.getTitle);
router.get('/getAllTitles', TitleController.getTitles);

module.exports = router;