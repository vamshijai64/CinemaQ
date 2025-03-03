const MovieReviewModel=require('../models/movieReview')

exports.addMovieReview = async ({ title, content, rating,imageUrl, user }) => {
    try {
        const review = new MovieReviewModel({
          title,
          content,
          rating,
          imageUrl,
          user,
        });
    
        return await review.save();
      } catch (error) {
        throw new Error("Error saving movie review: " + error.message);
      }
};
exports.getMovieReviews=async(req,res)=>{
    return await MovieReviewModel.find().sort({createdAt:-1}).populate('user');

}

exports.getMovieReviewBytitle = async (title) => {
    return await MovieReviewModel.findOne({ title }).populate('user');
}

exports.getMovieReviewById = async (id) => {
    return await MovieReviewModel.findOne({ id }).populate('user');
}

