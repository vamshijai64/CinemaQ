const express=require('express');
const router=express.Router();
const GameController=require('../controllers/GameContorller');

router.get('/GameDashBoard',GameController.getGameApiDashboard)

module.exports=router;