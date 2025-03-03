const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const upload = require('../middlewares/uploadMiddleware');

//these are hashtags routes
// router.post('/create', quizController.createQuiz);
// router.get('/all', quizController.getAllQuizzes);
// router.get('/:id', quizController.getQuizById);



// old Routes for quizzes
router.post('/create', quizController.createQuiz);
router.get("/subcategory/:subcategoryId",quizController.getRandomQuiz)
//router.get('/:subcategoryId', quizController.getQuizzesBySubcategory);
//router.get("/subcategory/:subcategoryId/random", quizController.getRandomQuestionsBySubcategory);
router.get('/', quizController.getAllQuizzes);
router.put('/:quizId/questions/:questionId', quizController.updateQuestion);
router.get('/hashtag/:tag', quizController.fetchQuestionsByHashtag);
router.delete('/delete/:id',quizController.deleteQuiz)


module.exports = router;
