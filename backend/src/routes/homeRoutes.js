// homeRoutes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');



router.get('/homepage', homeController.gethome);

// Get all data for a specific section (movie news, movie reviews, quizzes)
router.get('/all-data', homeController.getAllData);

module.exports = router;
