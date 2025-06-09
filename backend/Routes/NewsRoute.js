const express = require('express');
const router = express.Router();
const News = require('../models/News');
const upload = require('../utils/upload'); // your multer-cloudinary setup
const cloudinary = require('cloudinary').v2;

// CREATE news
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

        let photoUrl, photoPublicId;
        if (req.file) {
            photoUrl = req.file.path;
            photoPublicId = req.file.filename; // multer-cloudinary sets public_id here
        }

        const news = new News({ title, content, author, photoUrl, photoPublicId });
        await news.save();
        res.status(201).json(news);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE news by ID (optional photo replace)
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ error: 'News not found' });

        // Update text fields
        if (title) news.title = title;
        if (content) news.content = content;
        if (author) news.author = author;

        // Replace photo if a new one uploaded
        if (req.file) {
            // Delete old photo from Cloudinary
            if (news.photoPublicId) {
                await cloudinary.uploader.destroy(news.photoPublicId);
            }

            news.photoUrl = req.file.path;
            news.photoPublicId = req.file.filename;
        }

        await news.save();
        res.json(news);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE news by ID (also deletes photo)
router.delete('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ error: 'News not found' });

        // Delete photo from Cloudinary if exists
        if (news.photoPublicId) {
            await cloudinary.uploader.destroy(news.photoPublicId);
        }

        await news.remove();
        res.json({ message: 'News deleted' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all news (optional, you probably want this)
router.get('/', async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        res.json(newsList);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;