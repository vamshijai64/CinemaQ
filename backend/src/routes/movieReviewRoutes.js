
const express = require('express');
const router = express.Router();    

const movieReviewController =require('../controllers/movieReviewController')

// Routes
router.post('/addmoviereview',  movieReviewController.addMovieReview);
router.get('/title/:title', movieReviewController.getMovieReviewBytitle);
router.get('/:id',movieReviewController.getMovieReviewById)
router.get('/', movieReviewController.getMovieReviews);

module.exports = router;




