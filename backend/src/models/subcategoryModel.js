// models/Subcategory.js
const mongoose = require('mongoose');


const subcategorySchema = new mongoose.Schema({
  
  name: { type: String, required: true },

  image:{type:String},

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true },
  quizzes: 
  [
    { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz' 
  }
]
}, { timestamps: true });
// Create a case-insensitive unique index
subcategorySchema.index({ name: 1 }, { unique: true });



module.exports = mongoose.model('Subcategory', subcategorySchema);
