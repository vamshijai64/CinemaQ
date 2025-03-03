// const mongoose=require('mongoose')

// const quizSchema= new mongoose.Schema({
//   title:{
//     type:String,
//    default:null,
//   },
//   subcategory:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'Subcategory',
//     required:true
//   },
//   category:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'Category',
//     required:true,

//   },
 
//   questions:[{
//     type:mongoose.Types.ObjectId,
//     ref:'Question'
//   }]

// },{timestamps:true});

// quizSchema.index({ hashtags: 1 });


// module.exports=mongoose.model('Quiz',quizSchema)


const mongoose = require('mongoose');  

const quizSchema = new mongoose.Schema({
  title: { 
    type: String,  
    default: "", 
  },
  subcategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory', 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  questions: [
    {
      question: { 
        type: String, 
        required: true 
      },
      options: [
        { 
          id: { type: String, required: true }, 
          name: { type: String, required: true } 
        }
      ],
      correctOption: { 
        id: { type: String, required: true }, 
      },
      hint: {  // Adding hint field
        type: String, 
        default: null,
      },
      image:{ 
        type: String, 
        default: null,
      },
      hashtags: [
        { 
          type: String, 
          
          trim: true, 
          lowercase: true, // Ensures consistency
        }
      ],
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);





// //..........number type...........//
// // models/Quiz.js
// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true },

//   subcategory: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Subcategory', 
//     required: true },
//   questions: [
//     {
//       question: { 
//         type: String, 
//         required: true
//        },
//       options:
//        [
//         { 
//           type: String,
//           required: true
//          }
//         ],
//       correctOption:
//       { 
//         type: Number, required: true }
//     },
//   ]
// }, { timestamps: true });

// module.exports = mongoose.model('Quiz', quizSchema);