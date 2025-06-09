    // models/News.js
    const mongoose = require('mongoose');

    const newsSchema = new mongoose.Schema({
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        photoUrl: { type: String }, // Cloudinary URL
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }, { timestamps: true });

    module.exports = mongoose.model('News', newsSchema);
