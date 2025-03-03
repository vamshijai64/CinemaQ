const express = require('express');
const router = express.Router();
const userAuth = require("../middlewares/authMiddleware");
const adminAuth = require("../middlewares/adminAuthMiddleware");
const reviewController = require('../controllers/reviewController');


router.post('/writeReview/:titleId', reviewController.writeReview);
router.get('/reviews/:titleId', reviewController.getReviewsForTitle);
router.delete("/user/:reviewId", userAuth, reviewController.deleteReview);

// For admin: working
router.delete("/admin/:reviewId", adminAuth, reviewController.deleteReview);








// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviewController');
// const upload = require('../middlewares/uploadMiddleware');
// // router.post('/movies/:title/addReview', reviewController.addReview);
// // Fetch reviews with sorting and filteringddReview);
// // Fetch reviews with sorting and filtering
// // Example: GET /reviews?sort=desc&rating=4&title=Inception
// // router.get('/movies/:title/getReviews', reviewController.getReviews);
// router.post('/movies/addReview',upload.single('image'), reviewController.addReview);
// router.get('/movies/getAllReviews', reviewController.getAllReviews);
// router.get('/movies/:id', reviewController.getReviews);
// // router.get('/movies/:id/getReviews', reviewController.getReviews);

// // router.post('/movies/:id/addReview', reviewController.addReview);

// // // GET http://localhost:6000/review/movies/1/reviews?sort=desc
// // // GET http://localhost:6000/review/movies/1/reviews?rating=4
// // // GET http://localhost:6000/review/movies/1/reviews?userId=12345
// // // GET http://localhost:6000/review/movies/1/reviews?sort=asc
// // router.get('/movies/:id/getReviews', reviewController.getReviews);

module.exports = router;