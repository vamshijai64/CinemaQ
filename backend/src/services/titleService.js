const Title = require('../models/titleModel');

exports.addTitle = async (title, imageUrl) => {
    
    const existingTitle = await Title.findOne({ title });
    if(existingTitle) {
        throw new Error('Title already exist.');
    }

    const newTitle = new Title({ title, imageUrl });
    return await newTitle.save();
};

exports.getTitles = async () => {
    const titles = await Title.find();
    if(!titles || titles.length === 0) {
        throw new Error('Titles not found');
    }

    return titles;
};

exports.getTitle = async (id) => {
    const title = await Title.findById(id);
    return title;
};