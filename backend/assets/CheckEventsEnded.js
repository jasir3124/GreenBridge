const cron = require('node-cron');
const Event = require('../Models/Events');
const User = require('../Models/User');

// Run every hour to check for ended events
cron.schedule('0 * * * *', async () => {
    console.log('Checking for ended events...');

    try {
        const now = new Date();

        // Find events that have ended but points haven't been awarded yet
        const endedEvents = await Event.find({
            date: { $lt: now }, // Event date is in the past
            pointsAwarded: { $ne: true } // Points haven't been awarded yet
        });

        for (const event of endedEvents) {
            // Get all users who attended this event
            const attendees = await User.find({
                attendedEvents: event._id
            });

            // Award points to each attendee
            for (const user of attendees) {
                user.greenPoints += event.greenPoints || 25;
                await user.save();
                console.log(`Awarded ${event.greenPoints || 25} points to ${user.fullName} for event: ${event.title}`);
            }

            // Mark event as points awarded
            event.pointsAwarded = true;
            await event.save();

            console.log(`Points awarded for ended event: ${event.title}`);
        }
    } catch (error) {
        console.error('Error awarding points for ended events:', error);
    }
});