const questionService = require('../services/questionService');
const Quiz=require('../models/QuizModel')

exports.createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json({ success: true, message: "Question created successfully", data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
      const questions = await questionService.getAllQuestions();
      res.status(200).json({ success: true, data: questions });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuestionById  = async (req, res) => {
  try {
    const questions = await questionService.getQuestionById(req.params.quizId);
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
      const updatedQuestion = await questionService.updateQuestion(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedQuestion });
  } catch (error) {
      res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
      await questionService.deleteQuestion(req.params.id);
      res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

