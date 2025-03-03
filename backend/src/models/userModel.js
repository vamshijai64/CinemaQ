// // // const mongoose = require('mongoose')
// // // const counter = require('../configs/counterIncrement')

// // // const userSchema = mongoose.Schema(
// // //     {
// // //     _id: { type: Number },
// // //     username: { type: String, unique: true, required: true },
// // //     email: { type: String, unique: true, sparse: true }, // Email is optional for mobile login
// // //     password: { type: String }, // Password is optional for mobile login
// // //     phoneNumber: { type: String, unique: true, sparse: true }, // Phone number for mobile login
// // //     loginType: { type: String, enum: ['social', 'mobile'], required: true }, // To differentiate login types
// // //     }, 
// // //     { _id: false }
// // // );

// // // userSchema.pre('save', async function (next) {
// // //     if(this.isNew) {
// // //         const nextId = await counter.getNextSequenceValue('UserIDs');
// // //         this._id = nextId;
// // //     }
// // //     next()
// // // })

// // // module.exports = mongoose.model("User", userSchema);




// // const mongoose = require('mongoose')
// // //const counter = require('../configs/counterIncrement')

// // const userSchema = mongoose.Schema({
// //     //_id: { type: Number },
// //     username: { type: String, unique: true, required: true },
// //     email: { type: String, unique: true, sparse: true }, // Email is optional for mobile login
// //     password: { type: String }, // Password is optional for mobile login
// //     // phoneNumber: { type: String, unique: true, sparse: true }, // Phone number for mobile login
// //     loginType: { type: String, enum: ['social'], required: true }, // To differentiate login types
// //     profileImage: { type: String } // Store image URL or path
// // });

// // // userSchema.pre('save', async function (next) {
// // //     if(this.isNew) {
// // //         const nextId = await counter.getNextSequenceValue('UserIDs');
// // //         this._id = nextId;
// // //     }
// // //     next()
// // // })

// // module.exports = mongoose.model("User", userSchema);


// const mongoose = require('mongoose')
// const userSchema = mongoose.Schema({
   
//     // username: { type: String, unique: true, required: true },
//     // email: { type: String, unique: true, sparse: true }, // Email is optional for mobile login
//     // password: { type: String }, // Password is optional for mobile login
//     // // phoneNumber: { type: String, unique: true, sparse: true }, // Phone number for mobile login
//     // loginType: { type: String, enum: ['social', 'admin'], required: true }, // To differentiate login types
//     // role: { type: String, enum: ['user', 'admin'], default: 'user' }, // ✅ Role-based access
//     // gender: { type: String, enum: ['male', 'female'] },
//     // profileImage: { type: String } // Store image URL or path


//     username: { type: String, unique: true, required: false },
//     email: { type: String, unique: true, sparse: true }, // Email is optional for mobile login
//     password: { type: String }, // Password is optional for mobile login
//     // phoneNumber: { type: String, unique: true, sparse: true }, // Phone number for mobile login
//     loginType: { type: String, enum: ['social'], required: true }, // To differentiate login types
//     role: { type: String, default: 'user' }, // ✅ Role-based access
//     gender: { type: String },
//     fan: { type: String },
//     profileImage: { type: String }, // Store image URL or path

// },);



// module.exports = mongoose.model("User", userSchema)


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    gender: { type: String },
    fan: { type: String },
    profileImage: { type: String },
})

userSchema.pre('save', async function (next) {
    // Ensure password is not already hashed before rehashing
    if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);
