const express = require('express');
const router = express.Router();
const News = require('../Models/News');
const upload = require('../assets/cloudinary'); // multer-cloudinary setup

// CREATE news with optional photo
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        const news = new News({
            title,
            content,
            author,
            photoUrl: req.file?.path, // save photo URL if uploaded
        });

        await news.save();
        res.status(201).json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE news (replace photo if new uploaded)
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ error: 'News not found' });

        const { title, content, author } = req.body;
        if (title) news.title = title;
        if (content) news.content = content;
        if (author) news.author = author;
        if (req.file) news.photoUrl = req.file.path;

        await news.save();
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE news by ID
router.delete('/:id', async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).json({ error: 'News not found' });
        res.json({ message: 'News deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all news
router.get('/', async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        res.json(newsList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
