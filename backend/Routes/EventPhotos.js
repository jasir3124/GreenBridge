const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/photos - Get all user-submitted photos (with event info)
router.get('/photos', async (req, res) => {
    try {
        const events = await Event.find({ 'userSubmittedPhotos.0': { $exists: true } })
            .populate('userSubmittedPhotos.submittedBy', 'name')
            .select('title userSubmittedPhotos');

        const photos = [];

        events.forEach(event => {
            event.userSubmittedPhotos.forEach(photo => {
                photos.push({
                    eventId: event._id,
                    eventTitle: event.title,
                    photoId: photo._id,
                    imageUrl: photo.url,
                    userName: photo.submittedBy?.name || 'Unknown',
                    submittedAt: photo.submittedAt,
                    status: photo.status,  // <-- changed from approved to status
                });
            });
        });

        res.json(photos);
    } catch (err) {
        console.error('Error fetching submitted photos:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/photos/:eventId/:photoId - Update photo status
router.patch('/photos/:eventId/:photoId', async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: '`status` must be one of: pending, accepted, rejected' });
    }

    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        const photo = event.userSubmittedPhotos.id(req.params.photoId);
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        photo.status = status;
        await event.save();

        res.json({ success: true, photo });
    } catch (err) {
        console.error('Error updating photo status:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
