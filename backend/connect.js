// backend/connect.js
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_DB_URI;

if (!uri) {
    throw new Error("MONGO_DB_URI not defined in .env");
}

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB with Mongoose');
    } catch (err) {
        console.error('❌ Mongoose connection error:', err.message);
        throw err;
    }
}

module.exports = connect;
