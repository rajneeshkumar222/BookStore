const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const Book = require("../model/book");
const Order = require("../model/order");
const User = require("../model/user");

// placed Oreder 

router.post("/placeorder", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDatafromDb = await newOrder.save();
            // saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDatafromDb._id },
            });
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Order Placed Successfully",

        });

    }
    catch (e) {
        return res.status(500).json({

            message: "Error Occurred",

        });
    }
})

// get order history of particular user

// router.get("/getorderhistory", authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.headers;
//         const userData = await User.findById(id).populate({
//             path: "order",
//             populate: { path: "book" },
//         });

//         const orderData = userData.orders.reverse();

//         return res.status(200).json({
//             status: "success",
//             data: orderData,

//         });

//     }
//     catch (e) {
//         return res.status(500).json({

//             message: "Error Occurred",

//         });
//     }
// })

router.get("/getorderhistory", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",  
            populate: { path: "book" },
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Populated Orders:", userData.orders); // Debugging

        const orderData = userData.orders?.length ? userData.orders.reverse() : [];

        return res.status(200).json({
            status: "success",
            data: orderData,
        });
    } catch (e) {
        console.error("Error fetching order history:", e);
        return res.status(500).json({ message: "Error Occurred" });
    }
});



// get all order --> admin

router.get("/getallorder", authenticateToken, async (req, res) => {
    try {
        const userData = await User.findById(id).populate({
            path: "book",
            populate: { path: "user" },
        }).sort({ createAt: -1 });

        return res.status(200).json({
            status: "success",
            data: userData,

        });

    }
    catch (e) {
        return res.status(500).json({

            message: "Error Occurred",

        });
    }
})

// update order --->> admin

router.put("/updatestatus", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        await Order.findByIdAndUpdate(id, { status: req.body.status });

        return res.status(200).json({
            status: "success",
            message: "Status Upadate Successfully",

        });

    }
    catch (e) {
        return res.status(500).json({

            message: "Error Occurred",

        });
    }
})



module.exports = router;