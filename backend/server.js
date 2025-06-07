// backend/server.js
const express = require('express');
const connect = require('./connect');

const authRoutes = require('./Routes/AuthRoutes');

const app = express();
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
