// backend/server.js
const express = require('express');
const connect = require('./connect');
const cors = require('cors');
const app = express();

const authRoutes = require('./Routes/AuthRoutes');

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8081",
        ],
        credentials: true,
    })
);

const port = 5000;

app.use(express.json()); // Middleware

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World with Mongoose!');
});

const startServer = async () => {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
