const quizService=require('../services/quizService')

exports.createQuiz = async (req, res) => {
  try {
    const { title, subcategory ,category,questions } = req.body;
    const quiz = await quizService.createQuiz(title, subcategory,category, questions);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
    console.log(error,"quiz error");
    
  }
  
};

// exports.getQuizzesBySubcategory = async (req, res) => {
//   try {
//     const { subcategoryId } = req.params;
//     const quizzes = await quizService.getQuizzesBySubcategory(subcategoryId);
//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
//   }
// };



exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
    console.log(error,"getall errror");
    
  }
};


exports.getRandomQuiz = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    console.log("Fetching questions for subcategory:", subcategoryId); // Debugging log

    const quizData = await quizService.getRandomQuizQuestions(subcategoryId);

    if (!quizData || quizData.error) {
      return res.status(404).json({ message: quizData?.error || "No questions found." });
    }

    // Use quizData.questions, not 'questions'
    const randomQuestions = quizData.questions.sort(() => 0.5 - Math.random()).slice(0, 9);

    res.status(200).json({ ...quizData, questions: randomQuestions });
  } catch (error) {
    console.error("Error fetching random questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




exports.getLatestQuizzes = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, subcategory } = req.query;

        const quizzes = await quizService.getLatestQuizzes({
            page: parseInt(page),
            limit: parseInt(limit),
            category,
            subcategory
        });

        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuestion=async(req,res)=>{
try{
  const {quizId,questionId}=req.params;
  const updateData=req.body;
  const updateQuiz= quizService.updateQuestion(quizId,questionId,updateData);
  res.json({messgae:"Question update succefully",quiz:updateQuiz})
}catch{
  res.status(500).json({message:error.message})
}
}

exports.fetchQuestionsByHashtag = async (req, res) => {
  try {
      const { tag } = req.params;
      const response = await quizService.getQuestionsByHashtag(tag);

      if (!response.success) {
          return res.status(404).json({ message: response.message });
      }

      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.deleteQuiz=async (req,res)=>{

  try {
    const { quizId } = req.params; // Get the quiz ID from request params
    const result = await quizService.deleteQuiz(quizId); // Call service function
    res.status(200).json(result); // Send response
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
}



// exports.createQuiz=async(req,res)=>{
//    try {
//     const quiz= await quizService.createQuiz(req.body) 
//     res.status(201).json({success:true,message:'Quiz created successfully',data:quiz})
    
//    } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
    
//    }
// }

// exports.getAllQuizzes = async (req, res) => {
//   try {
//     const quizzes = await quizService.getAllQuizzes();
//     res.status(200).json({ success: true, data: quizzes });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getQuizById = async (req, res) => {
//   try {
//     const quiz = await quizService.getQuizById(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quiz', error });
//   }
// };


