const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');


router.post('/create', questionController.createQuestion);

//  Get all questions
router.get('/all', questionController.getAllQuestions);

//  Get a specific question by ID
router.get('/:id', questionController.getQuestionById);

//  Update a question
router.put('/update/:id', questionController.updateQuestion);

//  Delete a question
router.delete('/delete/:id', questionController.deleteQuestion);


module.exports = router;
