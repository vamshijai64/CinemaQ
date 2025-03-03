const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware'); // Middleware for handling file uploads
const authMiddleware = require("../middlewares/authMiddleware");
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

// Social login (Google)
router.post('/social-register', userController.socialRegister);
router.post('/social-login', userController.socialLogin);

router.get('/profile/:userId', authMiddleware, userController.getUserProfile);
router.put('/profile/update', authMiddleware, upload.single('profileImage'), userController.updateUserProfile);

router.post('/forgot-password', userController.forgotPassword);
router.post('/validate-otp', userController.validateOtp);
router.post('/reset-password', userController.resetPassword);

router.get('/users', adminAuthMiddleware, userController.getAllUsers);

module.exports = router;




//old routes
// const express = require('express')
// const router = express.Router();
// const userController = require('../controllers/userController')

// const upload = require('../middlewares/uploadMiddleware'); // Middleware for handling file uploads

// router.post('/social-register', userController.socialRegister);
// router.post('/social-login', userController.socialLogin);

// router.get('/users', userController.getAllUsers);
// router.get('/profile/:userId', userController.getUserProfile);
// router.put('/profile/update', upload.single('profileImage'), userController.updateUserProfile);

// router.post('/forgot-password', userController.forgotPassword);
// router.post('/validate-otp', userController.validateOtp);
// router.post('/reset-password', userController.resetPassword);

// // router.get('/profile/:userId', userController.getUserProfile);
// // router.post('/profile/upload', upload.single('profileImage'), userController.updateProfileImage);
// // router.put('/profile/edit', userController.editUserProfile);

// // Mobile login
// // router.post('/mobile-register', userController.mobileRegister);
// // router.post('/request-otp', userController.requestOtp);
// // router.post('/mobile-login', userController.mobileLogin);


// // router.post('/register', userController.registerUser)
// // router.post('/request-otp', userController.requestOtp)
// // router.post('/login', userController.loginUser)

// module.exports = router;