const express = require("express");
const router = express.Router();
const upload = require("../assets/cloudinary");


const User = require("../Models/User");
const Event = require("../Models/Events");

router.get("/getAllEvents", async (req, res) => {
    const events = await Event.find({});
    console.log(events);
    res.status(200).json({data: events});
})

router.post("/createEvent", upload.single('image'), async (req, res) => {
    console.log('req.file:', req.file); // Add this line
    console.log('req.body:', req.body); // Add this too
    try {
        const {title, description, date, time, location, attendees} = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({error: 'No image file provided'});
        }

        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            imageUrl: req.file.path, // Cloudinary URL
            attendees: attendees ? JSON.parse(attendees) : [],
        });

        await newEvent.save();
        console.log('Event created:', newEvent.toObject());
        console.log('Cloudinary URL:', req.file.path);
        res.status(201).json({message: 'Event created', event: newEvent});
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({error: 'Internal server error', details: err.message});
    }
});

router.put('/updateEvent/:id', upload.single('image'), async (req, res) => {
    try {
        const eventId = req.params.id;
        const {title, description, date, location, attendees} = req.body;

        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return res.status(404).json({error: 'Event not found'});
        }

        if (req.file) {
            existingEvent.imageUrl = req.file.path;
        }

        if (title) existingEvent.title = title;
        if (description) existingEvent.description = description;
        if (date) existingEvent.date = date;
        if (location) existingEvent.location = location;
        if (attendees) existingEvent.attendees = JSON.parse(attendees);

        const updatedEvent = await existingEvent.save();

        res.status(200).json({message: 'Event updated', event: updatedEvent});
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.put("/attendedEvent/:id", async (req, res) => {
    const eventId = req.params.id;
    const userId = req.body.userId;

    try {
        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is registered for this event
        if (!user.registeredEvents.includes(eventId)) {
            return res.status(400).json({ message: "User is not registered for this event" });
        }

        // Check if user already attended this event
        if (user.attendedEvents.includes(eventId)) {
            return res.status(400).json({ message: "Attendance already recorded for this event" });
        }

        // Record attendance and award points
        user.attendedEvents.push(eventId);
        user.greenPoints += (event.greenPoints || 25); // Award points from event or default 25
        await user.save();

        res.status(200).json({
            message: "Attendance recorded successfully",
            data: {
                eventId,
                userId,
                pointsAwarded: event.greenPoints || 25,
                totalPoints: user.greenPoints
            }
        });
    } catch (error) {
        console.error("Error while recording attendance:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
module.exports = router