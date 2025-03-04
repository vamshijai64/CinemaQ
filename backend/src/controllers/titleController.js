const TitleService = require('../services/titleService');

exports.addTitle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const { title } = req.body;
      //  const imageUrl = req.file.path;
const imageUrl = `/uploads/${req.file.filename}`;
        
        const data = await TitleService.addTitle(title, imageUrl);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTitles = async (req, res) => {
   try {
        const data = await TitleService.getTitles();
        res.status(200).json(data)
   } catch (error) {
        res.status(500).json({ error: error.message });
   }
};

exports.getTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TitleService.getTitle(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
















