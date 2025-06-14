// backend/server.js
const express = require('express');
const connect = require('./connect');
const cors = require('cors');
const app = express();

const authRoutes = require('./Routes/AuthRoutes');
const eventRoutes = require('./Routes/EventRoutes');
const userRoutes = require('./Routes/UserRoutes');
const eventPhotoRoutes = require('./Routes/EventPhotos');

app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                "http://localhost:8081"
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json()); // Middleware

const port = 5000;

app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/users', userRoutes);
app.use("/api/dashboard", require("./Routes/dashboard"));
app.use('/api/photos', eventPhotoRoutes);

app.get('/', (req, res) => {
    res.send('Hello World with Mongoose!');
});

const startServer = async () => {
    try {
        await connect();
        require("./assets/CheckEventsEnded");
        app.listen(port, () => {
            console.log(`✅ Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
