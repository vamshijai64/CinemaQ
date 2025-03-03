const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Route to create a banner
router.post('/banners', bannerController.createBanner);

// Route to get all banners (filter by isActive optional)
router.get('/banners', bannerController.getAllBanners);

// Route to update a banner
router.put('/banners/:id', bannerController.updateBanner);

// Route to delete a banner
router.delete('/banners/:id', bannerController.deleteBanner);

// Route to toggle banner status (active/inactive)
router.patch('/banners/:id/toggle', bannerController.toggleBannerStatus);

module.exports = router;
