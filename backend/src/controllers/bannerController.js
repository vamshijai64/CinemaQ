const bannerService = require('../services/bannerService');

// Create a new banner
const createBanner = async (req, res) => {
  try {
    console.log("Received request to create a banner:", req.body);
    const newBanner = await bannerService.addBanner(req.body);
    console.log(newBanner);
    
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error });
  }
};

// Get all banners (optional filter for active)
const getAllBanners = async (req, res) => {
    try {
      const banners = await bannerService.getAllBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Error fetching banners", error: error.message });
    }
  };

// Update a banner
const updateBanner = async (req, res) => {
  try {
    const updatedBanner = await bannerService.updateBanner(req.params.id, req.body);
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error });
  }
};

// Delete a banner
const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.status(204).json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error });
  }
};

// Toggle banner active status
const toggleBannerStatus = async (req, res) => {
  try {
    const updatedBanner = await bannerService.toggleBannerStatus(req.params.id);
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling banner status', error });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
};
