// models/Event.js
const mongoose = require('mongoose');

const userSubmittedPhotoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    date: {type: Date, required: true},
    imageUrl: {type: String},
    greenPoints: {type: Number, default: 0},
    pointsAwarded: {
        type: Boolean,
        default: false
    },
    category: [String],
    createdAt: {type: Date, default: Date.now},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    eventPhotos: [String],
    userSubmittedPhotos: [userSubmittedPhotoSchema],
});

eventSchema.virtual('status').get(function () {
    const now = new Date();
    const eventDate = new Date(this.date);

    if (eventDate > now) return 'upcoming';

    // Assuming the event lasts for the whole day
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (now >= eventDate && now <= endOfDay) return 'ongoing';

    return 'completed';
});

eventSchema.set('toObject', { virtuals: true });
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
