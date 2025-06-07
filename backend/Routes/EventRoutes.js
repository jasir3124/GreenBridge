const express = require("express");
const router = express.Router();
const upload = require("../assets/cloudinary");

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

router.put("/updateEvent", (req, res) => {
    router.put('/updateEvent/:id', upload.single('image'), async (req, res) => {
        try {
            const eventId = req.params.id;
            const { title, description, date, location, attendees } = req.body;

            const existingEvent = await Event.findById(eventId);
            if (!existingEvent) {
                return res.status(404).json({ error: 'Event not found' });
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

            res.status(200).json({ message: 'Event updated', event: updatedEvent });
        } catch (err) {
            console.error('Error updating event:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

})

module.exports = router