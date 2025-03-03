const mongoose=require('mongoose');

const questionSchema= new mongoose.Schema({
    quizId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Quiz',
        required:true,
    },
    question:{
        type:String,
        required:true
    },
    image:{
       type:String,
       default:null
    },
    options:[
      {
        id:{type:String,required:true},
        name:{type:String,required:true}
      }
   ],
   correctOption:{
    id:{ type:String,required:true},
    name: { type: String, required: true }
   },
   hints:[{
    type:String,
   }],
   hashtags: [{ type: String, set: tag => tag.toLowerCase().replace(/\s+/g, '') }]

 
},{timestamps:true});

questionSchema.index({ hashtags: 1 });

module.exports=mongoose.model('Question',questionSchema)