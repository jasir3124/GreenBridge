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
    tags: [String],
    createdAt: {type: Date, default: Date.now},
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    eventPhotos: [String],
    userSubmittedPhotos: [userSubmittedPhotoSchema],
});

eventSchema.virtual('isUpcoming').get(function () {
    return this.date > new Date();
});

eventSchema.virtual('isPast').get(function () {
    return this.date < new Date();
});

module.exports = mongoose.model('Event', eventSchema);
