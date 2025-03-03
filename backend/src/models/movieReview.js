const mongoose = require('mongoose');

const movieReviewSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },  
    rating:{
        type:Number,
        required:true,min:1,max:5
    },
    imageUrl:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },  
    createdAt: { type: Date, default: Date.now },
    })

    module.exports = mongoose.model('MovieReview', movieReviewSchema);  