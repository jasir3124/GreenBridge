const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/, // Basic email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Adjust based on your password policy
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    avatarUrl: {
        type: String,
        default: null,
    },
    greenPoints: {
        type: Number,
        default: 0,
    },
    registeredEvents: {
        type: [String],
        default: [],
    },
    attendedEvents: {
        type: [String],
        default: [],
    },
    rank: {
        type: [String],
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update updatedAt on save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
