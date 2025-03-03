const reviewService = require('../services/reviewService');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose')

exports.writeReview = async (req, res) => {
    try {
        const { titleId } = req.params;
        const reviewData = req.body; // userId, rating, reviewText

        const review = await reviewService.writeReview(titleId, reviewData);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReviewsForTitle = async (req, res) => {
    try {
        const { titleId } = req.params;
        const reviewsData = await reviewService.getReviewsForTitle(titleId);

        if (!reviewsData) {
            return res.status(404).json({ message: "No reviews found for this title" });
        }

        res.json(reviewsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        let requestingUserId = req.user?.userId || null;
        let isAdmin = req.admin?.role === "admin"

        if(!requestingUserId && !isAdmin) {
            return res.status(403).json({ error: "Unauthorized request" });
        }

        const result = await reviewService.deleteReview(reviewId, requestingUserId, isAdmin);
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






// const reviewService = require('../services/reviewService');

// exports.addReview = async (req, res) => {
//     try {
//        const{title } = req.body;
//        const reviewData= req.body;

//         //  Get image path from uploaded file
//         let imageUrl = null;
//         if (req.file) {
//             imageUrl = `/uploads/${req.file.filename}`;
//         }

//         const review = await reviewService.addReview({title,reviewData });
//         res.status(201).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.log(error);
        
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const id  = req.prams;

//         const reviews = await reviewService.getReviews(id);
//         res.status(200).json(reviews);
//     } catch (error) {
//         console.log(error);
        
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getAllReviews = async (req, res) => {
//     try {

//         const reviews = await reviewService.getAllReviews();
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const { title } = req.query;
//         const { sort = 'desc', rating, userId } = req.query;

//         if(!title) {
//             return res.status(400).json({ error: 'Movie title is required' });
//         }

//         const reviews = await reviewService.getReviews(title, { sort, rating, userId });
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// }


// With Movie Model reference
// exports.addReview = async (req, res) => {
//     try {
//         const { id: movieId } = req.params;
//         const reviewData = req.body;

//         // const { rating, reviewText } = req.body;
//         // Get userId from authenticated user (e.g., via JWT or session middleware)
//         // const userId = req.user.id;
//         // const review = await reviewService.addReview(movieId, { userId, rating, reviewText });
        
//         const review = await reviewService.addReview(movieId, reviewData);
//         res.status(201).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getReviews = async (req, res) => {
//     try {
//         const { id: movieId } = req.params;
//         const { sort = 'desc', rating, userId } = req.query;

//         const reviews = await reviewService.getReviews(movieId, { sort, rating, userId });
//         res.status(200).json(reviews);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }  
// };