const express = require("express");
const router = express.Router();

const Event = require("../Models/Events");
const User = require("../Models/User");

router.get("/getAllUsers", async (req, res) => {
    const users = await User.find({});
    console.log(users);
    res.status(200).json({data: users});
})

router.post("/createUser", async (req, res) => {
    const data = req.body;

    console.log(data);

    // Function to hash the password
    async function hashPassword(password) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            console.error("Error hashing password:", err);
            throw err;
        }
    }

    // check if account exist if yes return error if not create account
    try {
        const accountExists = await User.findOne({email: data.email});
        if (accountExists) {
            return res.status(409).json({
                message: "Account with this email already exists!",
                data: data,
            });
        }

        // Hash the user's password
        const hashedUserPassword = await hashPassword(data.password);

        const newUser = new User({
            fullName: data.fullName,
            email: data.email,
            password: hashedUserPassword,
        });

        await newUser.save();

        res.status(200).json({
            message: "Account created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error("Error while creating a new user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
})

router.put("/updateUser/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User updated successfully", data: updatedUser});
    } catch (error) {
        console.error("Error while updating user:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
})

router.delete("/deleteUser/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully", data: deletedUser});
    } catch (error) {
        console.error("Error while deleting user:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
})

router.put("/registerToEvent/:id", async (req, res) => {
    const eventId = req.params.id;
    const userId = req.body.userId;
    console.log(eventId, userId);
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Check if already registered
        if (user.registeredEvents.includes(eventId)) {
            return res.status(400).json({message: "User already registered for this event"});
        }

        // Add to both event attendees and user registeredEvents
        event.attendees.push(userId);
        user.registeredEvents.push(eventId);

        await event.save();
        await user.save();

        res.status(200).json({
            message: "User registered to event successfully",
            data: {event, userRegisteredEvents: user.registeredEvents.length}
        });
    } catch (error) {
        console.error("Error while registering user to event:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
});

router.put("/unregisterFromEvent/:id", async (req, res) => {
    const eventId = req.params.id;
    const userId = req.body.userId;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        // Remove from both event attendees and user registeredEvents
        event.attendees = event.attendees.filter(id => id !== userId);
        user.registeredEvents = user.registeredEvents.filter(id => id !== eventId);

        await event.save();
        await user.save();

        res.status(200).json({
            message: "User unregistered from event successfully",
            data: {event, userRegisteredEvents: user.registeredEvents.length}
        });
    } catch (error) {
        console.error("Error while unregistering user from event:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
});

module.exports = router