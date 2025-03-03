

const categoryModel=require("../models/CategeoryModel");
const subcategoryModel =require('../models/subcategoryModel');


exports.getGameApiDashboard= async(req,res)=>{
    try{
        //fetch latest catgeories

        const latestCategories = await categoryModel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
       .select(" name createdAt");

        //Fecth subcategrioes for each category with image
        const catgeroywithSubcategories = await Promise.all(
            latestCategories.map(async (category) => {
                const subcategories=await subcategoryModel.find({category:category._id}) 
                .sort({ createdAt: -1 })
                .select("name image createdAt")

                return{
                    title:category.name,
                    subcategories
                };
            })
        );
        const banners=[];

        if(latestCategories.length>0) {
             banners.push({type:"Categories",data:latestCategories})
        }

         const response=[
            {
                type:"Catgories",
                data:catgeroywithSubcategories
            }
         ]   
         res.json({banners,response})

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
