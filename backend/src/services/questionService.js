const Question = require('../models/Question');
const Quiz= require('../models/QuizModel')

exports.createQuestion = async (data) => {

  const {quizId,question,image,options, correctOption,hints,hashtags}=data;

  const existingQuiz=await Quiz.findById(quizId);
  if(!existingQuiz){
    throw new Error('Quiz not found');
  }

  const newQuestion=new Question({
    quizId,
    question,
    image,
    options,
    correctOption,
    hints,
    hashtags

  });

  const savedQuestion= await newQuestion.save();
   await Quiz.findByIdAndUpdate(quizId,{
    $push:{questions:savedQuestion._id}
   })

   return savedQuestion;
};




exports.getAllQuestions = async () => {
  return await Question.find().populate("quizId", "title");
};

exports.getQuestionById = async (id) => {
  return await Question.findById(id).populate("quizId", "title");
};

exports.updateQuestion = async (id, data) => {
  return await Question.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteQuestion = async (id) => {
  const question = await Question.findById(id);
  if (!question) {
      throw new Error("Question not found");
  }

  await Quiz.findByIdAndUpdate(question.quizId, {
      $pull: { questions: id }
  });

  return await Question.findByIdAndDelete(id);
};