// homeController.js
const movieNewsService = require('../services/movienewsService');
const movieReviewService = require('../services/movieReviewService');
const quizService = require('../services/quizService');
const categoryService = require('../services/categoryService');
const subcategoryService = require('../services/subcategoryService');
const bannerService = require('../services/bannerService');
const movieReviewmodel =require('../models/movieReview')
const reviewModel =require('../models/reviewModel')
const reviewSerivce = require('../services/reviewService')
const movieNewsmodel=require('../models/movienewsModel')
const bannermodel= require('../models/BannerModel')
const categoryModel=require('../models/CategeoryModel')
const quizModel=require('../models/QuizModel')
const subcategoryModel=require('../models/subcategoryModel');
const titleModel = require('../models/titleModel');


//{
// get home data future enhancemnets

//  future enhancements, you should consider:  Caching → Faster responses
//  Pagination → Load more data dynamically
// Search & Filtering → Better UX
// Indexing → Optimize large datasets
//  Real-time updates → WebSockets for live changes}
exports.gethome = async (req, res) => {
  try {
    // Fetch latest one for banners
    const latestMovieNews = await movieNewsmodel
      .findOne()
      .sort({ createdAt: -1 })
      .select("title description imageUrl createdAt");

    const latestMovieReview = await titleModel
      .findOne()
      .sort({ createdAt: -1 })
      .select("title  imageUrl createdAt");

    const latestCategory = await categoryModel
      .findOne()
      .sort({ createdAt: -1 })
      .select("name image createdAt");

    // Fetch latest 10 for response
    const movieNews = await movieNewsmodel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title description imageUrl createdAt");

    const movieReviews = await titleModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title rating reviewText imageUrl createdAt");

    const categories = await categoryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name image createdAt");

    const quizzes = await quizModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title image createdAt");

    // Fetch subcategories for each category with images
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await subcategoryModel
          .find({ category: category._id })
          .select("name image createdAt"); //  Ensure "image" is selected

        return { name: category.name, image: category.image, subcategories };
      })
    );

   
    const banners = [];
    if (latestMovieNews) banners.push({ type: "movieNews", data: latestMovieNews });
    if (latestMovieReview) banners.push({ type: "movieReviews", data: latestMovieReview });
    if (latestCategory) banners.push({ type: "categories", data: latestCategory });

    const response = [
      { type: "movieNews", data: movieNews },
      { type: "movieReviews", data: movieReviews },
      { type: "categories", data: categoriesWithSubcategories },
     // { type: "quizzes", data: quizzes },
    ];

    res.json({ banners, response });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({ error: "Failed to load homepage data" });
  }
};

exports.getAllData = async (req, res) => {
  
  try {
    const { section } = req.query;
    const data = {};
    
    if (section === 'movienews') {
      
      const latestBanners = await bannermodel
        .find({ bannerType: 'movieNews' })
        .sort({ createdAt: -1 })
        .limit(5);
        
    
      const excludedIds = latestBanners.map(banner => banner.relatedId);

     
      // Fetch all Movie News except the ones in banners
      data.movieNews = await movieNewsmodel
      .find({ _id: { $nin: excludedIds } })
      .sort({ createdAt: -1 })
      .select("-__v"); // Exclude version key
      
      
    } else if (section === 'reviews') {
      
      console.log("Fetching all movie reviews...");
      
      // Fetch all movie reviews
      data.movieReviews = await titleModel.find().sort({ createdAt: -1 }).select("-__v");
      
    } else if (section === 'subcategories') {
      console.log("Fetching all subcategories...");
      
      // Fetch all subcategories with their categories
      data.subcategories = await subcategoryModel
      .find()
      .populate("category", "name image")
      .sort({ createdAt: -1 })
      .select("-__v");
    }else if(section ==='category'){
      data.categories=await categoryModel.find().populate('category ','name image')
      .sort({createdAt:-1})
      .select('__v');
    }
    else{
      return res.status(400).json({error:'Inavaild section provided'})
    }
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch data for the selected section' });
  }
};



// exports.gethome = async (req, res) => {
//   try {
//     // Fetch latest one for banners
//     const latestMovieNews = await movieNewsmodel.findOne().sort({ createdAt: -1 }).select("-__v");
//     const latestMovieReview = await reviewModel.findOne().sort({ createdAt: -1 }).select("-__v");
//     const latestCategory = await categoryModel.findOne().sort({ createdAt: -1 }).select("-__v");

//     // Fetch latest 10 for response
//     const movieNews = await movieNewsmodel.find().sort({ createdAt: -1 }).limit(10).select("-__v");
//     const movieReviews = await reviewModel.find().sort({ createdAt: -1 }).limit(10).select("-__v");
//     const categories = await categoryModel.find().sort({ createdAt: -1 }).limit(10).select("-__v");
//     const quizzes = await quizModel.find().sort({ createdAt: -1 }).limit(10).select("-__v");

//     // Fetch subcategories for each category
//     const categoriesWithSubcategories = await Promise.all(
//       categories.map(async (category) => {
//         const subcategories = await subcategoryModel
//           .find({ category: category._id })
//           .select("name imageUrl");
//         return { name: category.name, subcategories };
//       })
//     );

//     // Construct the response
//     const banners = [];
//     if (latestMovieNews) banners.push({ type: "movieNews", data: latestMovieNews });
//     if (latestMovieReview) banners.push({ type: "movieReviews", data: latestMovieReview });
//     if (latestCategory) banners.push({ type: "categories", data: latestCategory });

//     const response = [
//       { type: "movieNews", data: movieNews },
//       { type: "movieReviews", data: movieReviews },
//       { type: "categories", data: categoriesWithSubcategories },
//       { type: "quizzes", data: quizzes }
//     ];

//     res.json({ banners, response });
//   } catch (error) {
//     console.error("Error fetching homepage data:", error);
//     res.status(500).json({ error: "Failed to load homepage data" });
//   }
// };

//this code working in forntend ---------------
// exports.gethome = async (req, res) => {
//   try {
//     const sections = [
//       { key: "movieNews", model: movieNewsmodel, limit: 15 },
//       { key: "movieReviews", model: reviewModel, limit: 15 },

//       // { key: "movieReviews", model: movieReviewmodel, limit: 5 },
//       { key: "categories", model: category, limit: 10 }
//     ];

//     let banners = [];
//     let response = [];

//     for (const section of sections) {
//       // Fetch actual data for banners and response
//       const sectionData = await section.model.find()
//         .select("-__v") // Exclude unwanted fields like versioning
//         .sort({ createdAt: -1 })
//         .limit(section.limit);

//       // Store same data in both banners and response
//       banners.push({ type: section.key, data: sectionData });
//       response.push({ type: section.key, data: sectionData });
//     }

//     res.json({
//       banners,
//       response
//     });

//   } catch (error) {
//     console.error('Error fetching homepage data', error);
//     res.status(500).json({ error: 'Failed to load homepage data' });
//   }
// };






//////////////////////////////////old code//////////////////////////////////////////////////////////////
// exports.getHomePageData = async (req, res) => {

//   try {
//     const {
//       movienews_limit = 10, 
//       moviereview_limit = 10, 
//       subcategories_limit = 10,
//       section = 'home'
//     } = req.query;

//     const data = {};

//     // Banners Section with specific categories
//     if (section === 'home' || section === 'banners') {
//       data.banners = [
//         { name: 'MovieNews' },
//         { name: 'MovieReviews' },
//         { name: 'Categories' }
//       ];
//     }

//     // Movie News Section
//     if (section === 'home' || section === 'movienews') {
//       data.movieNews = await movieNewsService.getMovieNews().then(news => news.slice(0, parseInt(movienews_limit)));
//     }

//     // Movie Reviews Section
//     if (section === 'home' || section === 'moviereviews') {
//       data.movieReviews = await movieReviewService.getMovieReviews().then(reviews => reviews.slice(0, parseInt(moviereview_limit)));
//     }

//     // Subcategories Section
//     if (section === 'home' || section === 'subcategories') {
//       data.subcategories = await subcategoryService.getAllSubcategories().then(subcategories => subcategories.slice(0, parseInt(subcategories_limit)));
//     }

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Unable to fetch home page data' });
//   }
// };




















// ///gethome single api 

//   // try {
//   //   // Fetch banners grouped by type
//   //   const movieNewsBanners = await bannermodel.find({ bannerType: 'movieNews' }).sort({ createdAt: -1 }).limit(5);
//   //   const movieReviewsBanners = await bannermodel.find({ bannerType: 'movieReviews' }).sort({ createdAt: -1 }).limit(5);
//   //   const quizzesBanners = await bannermodel.find({ bannerType: 'categories' }).sort({ createdAt: -1 }).limit(5);

//   //   res.json({
//   //     banners: [
//   //       { type: 'movieNews', data: movieNewsBanners },
//   //       { type: 'movieReviews', data: movieReviewsBanners },
//   //       { type: 'quizzes', data: quizzesBanners },
//   //     ],
//   //   });
//   // } catch (error) {
//   //   console.error('Error fetching banners', error);
//   //   res.status(500).json({ error: 'Failed to fetch banners' });
//   // }