// models/Category.js
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

  name: { type: String, required: true, unique: true },
  imageUrl:{type:String,default:null},
 
  subcategories: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subcategory' }]
},
 { timestamps: true });




module.exports = mongoose.model('Category', categorySchema);
