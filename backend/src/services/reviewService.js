
const Review = require('../models/reviewModel');
const Title = require('../models/titleModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');

exports.writeReview = async (titleId, reviewData) => { //title means titleId
    const { userId, rating, reviewText } = reviewData;

    const titleExists = await Title.findById(titleId);
    if (!titleExists) {
        throw new Error('Title not found');
    }

    if(rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    const newReview = new Review({ user: userId, title: titleId, rating, reviewText });
    return await newReview.save();
};

exports.getReviewsForTitle = async (titleId) => {
    const reviews = await Review.aggregate([
        { $match: { title: new mongoose.Types.ObjectId(titleId) } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        { $unwind: "$userDetails" },
        {
            $group: {
                _id: "$title",
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$rating" },
                ratingCounts: { $push: "$rating" },
                reviews: {
                    $push: {
                        username: "$userDetails.username",
                        profileImage: "$userDetails.profileImage",
                        reviewText: "$reviewText",
                        rating: "$rating",
                        createdAt: "$createdAt"
                    }
                }
            }
        }
    ]);

    if (!reviews.length) return null;

    // Calculate rating distribution (1 to 5 stars)
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews[0].ratingCounts.forEach(r => ratingDistribution[r]++);

    const total = reviews[0].totalReviews;
    const ratingPercentage = {};
    Object.keys(ratingDistribution).forEach(key => {
        ratingPercentage[key] = ((ratingDistribution[key] / total) * 100).toFixed(2) + "%";
    });

    return {
        totalReviews: reviews[0].totalReviews,
        averageRating: reviews[0].averageRating.toFixed(2),
        ratingDistribution: ratingPercentage,
        reviews: reviews[0].reviews,
    };
};

/**
 * Deletes a review based on review ID.
 * Only the review owner or an admin can delete it.
 */
exports.deleteReview = async (reviewId, requestingUserId, isAdmin) => {
    const review = await Review.findById(reviewId);

    if(!review) {
        throw new Error("Review not found");
    }

    // If user is not an admin, ensure they own the review
    if(!isAdmin && review.user.toString() !== requestingUserId) {
        throw new Error("You can only delete your own reviews");
    }

    // Delete review
    await Review.deleteOne({ _id: reviewId });
    return { message: "Review deleted successfully" }
};





// const Review = require('../models/reviewModel');
// const User = require('../models/userModel');

// exports.addReview = async ({  title, reviewData }) => {
//     const {userId, rating, reviewText, imageUrl}=reviewData
  
//     const existingUser = await User.findById(userId);
//     if(!existingUser) throw new Error('User does not exist');

//     const review = new Review({ user: userId, title,imageUrl, rating, reviewText });
//     await review.save();
//     return review;
// };

// exports.getReviews = async (id) => {
//    return await Review.findOne({ id }).populate('user');
// };

// exports.getAllReviews = async () => {
//     return await Review.find().sort({ createdAt: -1 }).populate('user', 'username');
// };

// exports.getReviews = async (title, filters) => {
//     const { sort, rating, userId } = filters;

//     const query = { title }

//     if (rating) query.rating = Number(rating);
//     if (userId) query.user = userId;

//     return await Review.find(query).sort({ rating: sort === 'desc' ? -1 : 1 }).populate('user', 'name');
// };


// With Movie Model reference
// exports.addReview = async (movieId, reviewData) => {
//         const { userId, rating, reviewText } = reviewData;
        
//         // Update average rating and associate review with movie
//         const movie = await Movie.findById(movieId);
//         if(!movie) {
//             throw new Error('Movie not found');
//         }

//         // Optionally check for duplicate review
//         // const existingReview = await Review.findOne({ movie: movieId, user: userId });
//         // if (existingReview) {
//         //     throw new Error('User has already reviewed this movie');
//         // }

//         const review = new Review({ user: userId, movie: movieId, rating, reviewText });
//         await review.save();

//         movie.reviews.push(review._id);
        
//         // Update average rating
//         // const reviews = await Review.find({ movie: movieId });
//         // const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
//         // movie.averageRating = avgRating;

//         // Optimized average rating calculation
//         movie.averageRating = ((movie.averageRating * movie.reviews.length) + rating) / (movie.reviews.length + 1);

//         await movie.save();
//         return review;
// };

// exports.getReviews = async (movieId, filters) => {
//     const { sort, rating, userId } = filters;

//     const query = { movie: movieId }; 

//     if (rating) query.rating = Number(rating); // Filter by specific rating
//     if (userId) query.user = userId; // Filter by specific user

//     // Fetch reviews with dynamic query and sort by rating
//     return await Review.find(query).sort({ rating: sort === 'desc' ? -1 : 1 }) // Sorting based on query parameter
//     .populate('user', 'name') // Populate user field to get user details (if needed)
//     .populate('movie', 'title'); // Populate movie field to get movie details (if needed)
// };