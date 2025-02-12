const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authenticateToken } = require("./auth");


// signup up logic likhe h yha ham

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check if username length is more than 4
        if (username.length < 4) {
            return res.status(400).json({
                message: "Username should be greater than 4"
            });
        }

        // Check if username already exists
        const existUsername = await User.findOne({ username: username });
        if (existUsername) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        // Check if email already exists
        const existEmail = await User.findOne({ email: email });
        if (existEmail) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // Check password length
        if (password.length <= 5) {
            return res.status(400).json({
                message: "Password should be greater than 5"
            });
        }

        // Hash the password
        const hashPass = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });
        await newUser.save();

        // Send success response
        return res.status(200).json({
            message: "Signup Successful"
        });

    } catch (e) {
        // Catch any unexpected errors
        console.error(e);
        return res.status(500).json({
            message: "Signup server error"
        });
    }
});


// ab hm yha login ka logic likhenge

router.post("/login", async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "Please fill all the details!" });
        }

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ message: "This user is not registered!" });
        }

        bcrypt.compare(password, existUser.password, (err, data) => {
            if (data) {

                const token = jwt.sign(
                    { id: existUser._id, role: existUser.role },
                    process.env.SECRET_KEY,
                    { expiresIn: "30d" }
                );


                return res.status(200).json({
                    id: existUser._id,
                    role: existUser.role,
                    token: token,
                    message: "Login Successfully",
                });
            } else {
                return res.status(401).json({ message: "Incorrect password!" });
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Login server error" });
    }
});




// get -user- information 

router.get("/auth", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        //   yha hm select isliye  bheje h taki ye password ko select krke use hta de kyuki yha minus(-) lga h isliye hta dega
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);

    }
    catch (e) {
        return res.status(404).json({
            message: "Internal server Error",
        });
    }
});




// ab jb user address ko update krega tb uska route 

router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({
            message: "Address updated successfully"
        });

    }
    catch (e) {
        return res.status(404).json({
            message: "Internal server Error",
        });
    }
})





module.exports = router