const express = require('express');
const router = express.Router();
const movienewsController = require('../controllers/movienewsController');
const upload=require('../middlewares/uploadMiddleware')


//Admin routes
router.post('/addmovienews',upload.single('image'),movienewsController.addMovieNews);

router.get('/latest', movienewsController.getLatestMovieNews);
//et a particular movie news by title
router.get('/:id',movienewsController.getMovieNewsById);


//this is the public route
router.get('/',movienewsController.getMovieNews);

module.exports = router;


module.exports = router;