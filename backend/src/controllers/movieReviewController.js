    const movieReviewService = require('../services/movieReviewService');

    exports.addMovieReview = async (req, res) => {
        try {
            const { title, content, rating, user } = req.body;
            const imageFile =req.file

            let imageUrl = null;
            if (imageFile) {
              imageUrl = `/uploads/${imageFile.filename}`; // ✅ Store image URL
            }
           // Call the service to save the review

            const movieReview = await movieReviewService.addMovieReview({ 
                title,
                 content, 
                 rating,
                  user,
                  imageUrl
                 });
    
            // Respond with success
            res.status(201).json({ message: 'Movie review added successfully', movieReview });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.log('movieReview error:', error);
        }
    };

    exports.getMovieReviewBytitle = async (req, res) => {
        
        try {
            const title = req.params.title;
            const review = await movieReviewService.getMovieReviewBytitle(title);
            res.json(review);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    exports.getMovieReviewById = async (req, res) => {
        
        try {
            const {id} = req.params.id;
            const review = await movieReviewService.getMovieReviewById(id);
            res.json(review);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    exports.getMovieReviews = async (req, res) => {
        try {
            const reviews = await movieReviewService.getMovieReviews();
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
