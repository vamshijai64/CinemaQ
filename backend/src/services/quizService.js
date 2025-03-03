
//this code old quiz serivce code..........
const QuizModel = require("../models/QuizModel");
const mongoose = require("mongoose");



const subcategoryModel = require("../models/subcategoryModel");


exports.createQuiz = async (title, subcategory,category, questions) => {

  try {
    const subcategoryDoc = await subcategoryModel.findById(subcategory);
    if (!subcategoryDoc) {
      throw new Error("Subcategory not found");
    }

    // Step 1: Check if a quiz already exists for this subcategory
    let existingQuiz = await QuizModel.findOne({ subcategory });

    if (existingQuiz) {
      // Step 2: If quiz exists, check for duplicate questions
      for (const questionObj of questions) {
        const isDuplicate = existingQuiz.questions.some(
          (q) => q.question === questionObj.question
        );

        if (isDuplicate) {
          throw new Error(`Duplicate question found: ${questionObj.question}`);
        }
      }

      // Step 3: Add new questions to the existing quiz
      existingQuiz.questions.push(...questions);
      await existingQuiz.save();

      return existingQuiz;
    } else {
      // Step 4: If no quiz exists, create a new one
      const newQuiz = new QuizModel({
        title,
        subcategory: subcategoryDoc._id,
        category,
        questions,
      });

      const savedQuiz = await newQuiz.save();

      subcategoryDoc.quizzes.push(savedQuiz._id);
      await subcategoryDoc.save();

      return savedQuiz;
    }
  } catch (error) {
    throw new Error("Error creating/updating quiz: " + error.message);
  }

};



exports.getAllQuizzes = async () => {
  try {
    const quizzes= await QuizModel.find()
      
      .populate({
        path: 'subcategory',
        populate: { path: 'category' } // Populate category inside subcategory
      });

      quizzes.forEach(quiz=>{
        quiz.questions=quiz.questions.map(question=>{
          const correctOption=question.options.find(option=>option.id=== question.correctOption.id);

          return{
            ...question.toObject(),
            correctOptionDetails:correctOption || null

          }
        })
      });
      return quizzes;

      // quizzes.forEach(quiz => {
      //   quiz.questions.forEach(question => {
      //     // Match the correct option based on the correctOption id
      //     const correctOption = question.options.find(option => option.id === question.correctOption.id);
      //     if (correctOption) {
      //       question.correctOption = correctOption; // Update correctOption field to match the option object
      //     }
      //   });
      // });
   //   return quizzes;


      
  } catch (error) {
    throw new Error('Error fetching quizzes: ' + error.message);
  }
};

exports.getRandomQuizQuestions=async(subcategoryId)=>{
  try{
    const quizzes=await QuizModel.find({subcategory:subcategoryId})
    .populate({
      path:"subcategory",
      select:"name image",
     })
     .populate({
      path:"category",
      select:"name imageUrl"
    }).populate({
      path:"questions",
      select:"question options image"
    });

    if (!quizzes.length) {
      return { error: "No quizzes found for this subcategory." };
    }

    
    let allQuestions = quizzes.flatMap((quiz) => quiz.questions);

    
    if (allQuestions.length > 9) {
      allQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 9);
    }
    return {
      quizTitle: quizzes[0].title,
      subcategory: quizzes[0].subcategory,
      category: quizzes[0].category,
      questions: allQuestions,
    };
  } catch (error) {
    console.error("Error in quiz service:", error);
    return { error: "Internal server error" };
  }
}





exports.getLatestQuizzes = async ({ page, limit, category, subcategory }) => {
    const query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;

    const quizzes = await QuizModel.find(query)
        .sort({ createdAt: -1 })  // Sort by latest
        .skip((page - 1) * limit) // Pagination
        .limit(limit)
        .populate('category subcategory'); // Populate category details

    const totalQuizzes = await QuizModel.countDocuments(query);

    return {
        quizzes,
        totalQuizzes,
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / limit)
    };
};

exports.updateQuestion = async(quizId,  questionId,updateData)=>{
  try {
    console.log(`🔍 Finding quiz with ID: ${quizId}`);
    const quiz = await QuizModel.findById(quizId);

    if (!quiz) throw new Error("Quiz not found");

    console.log("✅ Quiz found:", quiz._id);
    console.log("📌 Searching for question with ID:", questionId);
    console.log("📝 Available question IDs before update:", quiz.questions.map(q => q._id.toString()));

    // Find index of question
    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);

    if (questionIndex === -1) {
      throw new Error(`Question ID not found: ${questionId}`);
    }

    // ✅ Update the existing question inside the array
    quiz.questions[questionIndex].question = updateData.question;
    quiz.questions[questionIndex].correctOption = updateData.correctOption;
    quiz.questions[questionIndex].hint = updateData.hint;

    // ✅ Save the updated quiz
    const updatedQuiz = await quiz.save();

    console.log("📝 Available question IDs after update:", updatedQuiz.questions.map(q => q._id.toString()));
    console.log("✅ Question updated successfully!");

    return { message: "Question updated successfully", quiz: updatedQuiz };
  } catch (error) {
    console.error(` Update failed: ${error.message}`);
    throw new Error(`Update failed: ${error.message}`);
  }
}
exports.getQuestionsByHashtag = async (hashtag) => {
  try {
      const tag = `#${hashtag.toLowerCase()}`;
     // const quizzes = await QuizModel.find({ "questions.hashtags": tag });
     const quizzes = await QuizModel.find({
      "questions.hashtags": { $regex: `^${tag}$`, $options: "i" }  // Case-insensitive match
  });


      if (!quizzes.length) {
          return { success: false, message: "No questions found for this hashtag." };
      }

      // Extract matching questions
      const questions = quizzes.flatMap(quiz =>
          quiz.questions.filter(q => q.hashtags.includes(tag))
      );

      // Shuffle & return 9 random questions
      const shuffledQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 9);
      
      return { success: true, data: shuffledQuestions };
  } catch (error) {
      throw new Error(error.message);
  }
};




exports.deleteQuiz=async (quizId)=>{
  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Remove quiz ID from subcategory
      await subcategoryModel.findByIdAndUpdate(
      quiz.subcategory,
      { $pull: { quizzes: quizId } }, 
      { new: true }
    );

    // Delete the quiz
    await QuizModel.findByIdAndDelete(quizId);
    return { message: "Quiz deleted successfully" }; // Returning the result
  } catch (error) {
    throw new Error("Error deleting quiz: " + error.message);
  }
}




//create Quiz Old code
  // try {
  //   const subcategoryDoc = await subcategoryModel.findById(subcategory);
  //   if (!subcategoryDoc) {
  //     throw new Error('Subcategory not found');
  //   }
    
  //   for(const questionObj of questions){
  //     const existingQuiz= await QuizModel.findOne({
  //       subcategory,
  //       'questions.question':questionObj.question
  //     })

  //     if(existingQuiz){
  //       throw new Error(`Duplicate question found :${questionObj.question}`);
  //     }
  //        // Remove the _id field from each option in the question
  //       //  questionObj.options = questionObj.options.map(option => {
  //       //   const { _id, ...rest } = option;  // Remove the _id field
  //       //   return rest; // Return the option without _id
  //       // });
  //     }

  //   const quiz = new QuizModel({ title, subcategory: subcategoryDoc._id, category, questions });
  //   const savedQuiz= await quiz.save();


  //   subcategoryDoc.quizzes.push(savedQuiz._id);
  //   await subcategoryDoc.save();

  //   return savedQuiz;

  // } catch (error) {
  //   throw new Error('Error creating quiz:' + error.message);
  // }




// exports.getRandomQuestionsBySubcategory = async (subcategoryId) => {
//   try {
//     const objectId = new mongoose.Types.ObjectId(subcategoryId); // Convert to ObjectId

//     const quizzes = await QuizModel.aggregate([
//         { $match: { subcategory: objectId } }, // Ensure subcategory ID matches
//         { $unwind: "$questions" }, // Flatten questions array
//         { $sample: { size: 9 } }, // Get 9 random questions
//         { 
//             $project: { 
//                 _id: 0, 
//                 "questions.question": 1, 
//                 "questions.options": 1, 
//                 "questions.correctOption": 1 
//             } 
//         } 
//     ]);

//     return quizzes.map(q => q.questions); // Return only questions array
// } catch (error) {
//     console.error("Error fetching random questions:", error);
//     return [];
// }// Extract only the question objects
// };




// exports.getQuizzesBySubcategory = async (subcategoryId) => {
//   try {
//     return await QuizModel.find({ subcategory: subcategoryId });
//   } catch (error) {
//     throw new Error('Error fetching quizzes: ' + error.message);
//   }
// };

// exports.getQuizzesBySubcategory = async (subcategoryId) => {
//   const quizzes = await QuizModel.find({ subcategory: subcategoryId });

//   //  Limit questions to 9 per quiz
//   return quizzes.map(quiz => ({
//       ...quiz._doc,
//       questions: quiz.questions.slice(0, 9) // ✅ Only take the first 9 questions
//   }))
// };














//-----------------------------------------------------------

//this is the hashtags queestion
// const Subcategory=require('../models/subcategoryModel')
// const Quiz=require('../models/QuizModel')

// exports.createQuiz= async(data)=>{
  
//   const{title,subcategory,category}=data;

//   const existingSubcategory = await Subcategory.findById(subcategory);
//   if (!existingSubcategory) {
//       throw new Error('Subcategory not found');
//   }

//   const newQuiz= new Quiz({
//     title,
//     subcategory,
//     category,
   
//   });
//   const savedQuiz= await newQuiz.save();

//   await Subcategory.findByIdAndUpdate(subcategory,{
//     $push:{quizzes:savedQuiz.id}
//   })
//   return savedQuiz;

// }

// exports.getAllQuizzes = async () => {
//    try {
//         const quizzes = await Quiz.find()
//             .populate({
//                 path: 'subcategory',
//                 select: 'name image' // Include only name and image
//             })
//             .populate({
//                 path: 'category',
//                 select: 'name imageUrl' // Include only name and image
//             }).populate({
//               path: "questions", 
//               select: "question options image correctOption hints hashtags"
//             });
//             console.log(quizzes);
//         return quizzes;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };
// exports.getQuizById = async (id) => {
//   return await Quiz.findById(id)
//     .populate({
//       path: "subcategory",
//       select: "name image quizzes",
//       populate: {
//         path: "quizzes",
//         select: "title"
//       }
//     })
//     .populate({
//       path: "category",
//       select: "name imageUrl"
//     })
//     .populate({
//       path: "questions", 
//       select: "question options image correctOption hints"
//     })
//     .exec();
// };

// exports.getAllQuizzes = async () => {
//   return await Quiz.find().populate({
//     path: 'questions',
//     select: 'question options image correctOption hints'
//   }).exec();
// };

// exports.getQuizById = async (id) => {
//   return await Quiz.findById(id).populate({
//     path: 'questions',
//     select: 'question options image correctOption hints'
//   }).exec();
// };





// exports.getAllQuizzes = async () => {
//   try {
//     const quizzes = await QuizModel.find()
//       .populate({
//         path: 'subcategory',
//         select: '-__v -quizzes -createdAt -updatedAt',
//         populate: {
//           path: 'category',
//           select: '-__v -subcategories -createdAt -updatedAt',
//         },
//       })
//       .lean(); // Use lean to get plain JavaScript objects

//     // Process quizzes to match the correctOption and remove _id fields
//     const cleanedQuizzes = quizzes.map((quiz) => {
//       const { _id, __v, ...quizWithoutId } = quiz; // Remove _id and __v from quiz

//       quizWithoutId.questions = quiz.questions.map((question) => {
//         const { _id: questionId, ...questionWithoutId } = question; // Remove _id from question

//         // Match the correct option based on the correctOption id
//         const correctOption = question.options.find(
//           (option) => option.id === question.correctOption.id
//         );
//         if (correctOption) {
//           questionWithoutId.correctOption = {
//             id: correctOption.id,
//             name: correctOption.name,
//           };
//         }

//         // Remove _id from options
//         questionWithoutId.options = question.options.map(({ _id: optionId, ...option }) => option);

//         return questionWithoutId;
//       });

//       return quizWithoutId;
//     });

//     return cleanedQuizzes;
//   } catch (error) {
//     throw new Error('Error fetching quizzes: ' + error.message);
//   }
// };

