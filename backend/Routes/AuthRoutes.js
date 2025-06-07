const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../assets/generateToken");
const jwt = require("jsonwebtoken");

//* sign up user
router.post("/signUp", async (req, res) => {
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
        const accountExists = await User.findOne({ email: data.email });
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

        // const token = createSecretToken(newUser._id);
        //
        // res.cookie("GreenBridge_token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 3 * 24 * 60 * 60 * 1000,
        // });

        res.status(200).json({
            message: "Account created successfully",
            // token: token,
            data: newUser,
        });
    } catch (error) {
        console.error("Error while creating a new user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
});


//* login user
router.post("/login", async (req, res) => {
    const data = req.body;

    try {
        const userData = await User.findOne({ email: data.email });

        if (!userData) {
            res.status(404).json({
                message: "Account not found",
                data: data,
            });
        }

        bcrypt.compare(data.password, userData.password, (err, result) => {
            if (result) {
                const token = createSecretToken(userData._id);

                res.cookie("orderease_token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 3 * 24 * 60 * 60 * 1000,
                });

                res.status(200).json({
                    message: "Logged in successfully!",
                    token: token,
                    data: userData,
                });
            } else {
                res.status(401).json({
                    message: "Password is incorrect!",
                    data: userData,
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
});


// * Logout user
router.post('/logout', (req, res) => {
    res.clearCookie("orderease_token\n", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    return res.status(200).json({message: "user Logged Out Successfully"})
})


//* Verify JWT token
router.get("/verifyToken", (req, res) => {
    const token = req.cookies.orderease_token;

    if (!token) {
        res.clearCookie("orderease_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie("orderease_token", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.status(401).json({ message: "Invalid token" });
        }

        const cleanId = decoded.id.replace(/['"]/g, ""); // remove the extra '' from the id
        // Token is valid, return the user data
        User.findOne({ _id: cleanId })
            .then((user) => {
                res.status(200).json({ data: user });
            })
            .catch((err) => {
                res.clearCookie("orderease_token", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(500).json({ message: err });
            });
    });
});

module.exports = router;
