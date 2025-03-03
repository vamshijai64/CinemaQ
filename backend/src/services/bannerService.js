const Banner = require('../models/BannerModel');

// ✅ Add a new banner with dynamic fields
const addBanner = async (bannerData) => {
    // Ensure dynamic fields are stored inside `additionalData`
    const { name, imageUrl, startDate, endDate, bannerType, ...additionalData } = bannerData;

    const banner = new Banner({
        name,
        imageUrl,
        startDate,
        endDate,
        bannerType: bannerType || null, // If bannerType is missing, set it as null
        additionalData
    });

    await banner.save();
    console.log(" Banner created:", banner);
    return banner;
};

//  Get all banners with dynamic `isActive` calculation
const getAllBanners = async () => {
  return await Banner.find().sort({ priority: -1, startDate: -1 });
};


//  Update a banner
const updateBanner = async (id, bannerData) => {
    return await Banner.findByIdAndUpdate(id, bannerData, { new: true });
};

//  Delete a banner
const deleteBanner = async (id) => {
    return await Banner.findByIdAndDelete(id);
};

//  Toggle `isActive`
const toggleBannerStatus = async (id) => {
    const banner = await Banner.findById(id);
    banner.isActive = !banner.isActive;
    await banner.save();
    return banner;
};

module.exports = {
    addBanner,
    getAllBanners,
    updateBanner,
    deleteBanner,
    toggleBannerStatus 
};



// const Banner = require('../models/BannerModel');

// // Add a new banner
// const addBanner = async (bannerData) => {
//   const banner = new Banner(bannerData);
//   await banner.save();
//   console.log("✅ Banner created:", banner);
//   return banner;
// };

// // Get all banners (optionally filter active ones)
// const getAllBanners = async () => {

//     const currentDate = new Date();
//     const banners=await Banner.find();

//     return banners.map(banner=>{
//         banner.isActive= banner.startDate<=currentDate && banner.enddate>=currentDate;
//         return banner;
//     })



// //   const filter = isActive ? { isActive: true } : {};
// //   return await Banner.find(filter).sort({ priority: -1, startDate: -1 });
// };

// // Update a banner by ID
// const updateBanner = async (id, bannerData) => {
//   return await Banner.findByIdAndUpdate(id, bannerData, { new: true });
// };

// // Delete a banner by ID
// const deleteBanner = async (id) => {
//   return await Banner.findByIdAndDelete(id);
// };

// // Toggle the isActive field
// const toggleBannerStatus = async (id) => {
//   const banner = await Banner.findById(id);
//   banner.isActive = !banner.isActive;
//   await banner.save();
//   return banner;
// };

// module.exports = {
//   addBanner,
//   getAllBanners,
//   updateBanner,
//   deleteBanner,
//   toggleBannerStatus
// };
 