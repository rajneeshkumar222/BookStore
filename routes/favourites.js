const User = require("../model/user");
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");

// add book to favourites 

// router.put("/addfavouritebook", authenticateToken, async (req, res) => {
//     try {
//         const { bookid } = req.body;
//         const id = req.headers.id;

//         const bookObjectId = mongoose.Types.ObjectId(bookid);

//         if (!bookid || !id) {
//             return res.status(400).json({ message: "Missing bookid or user id" });
//         }

//         const userdata = await User.findById(id);
//         if (!userdata) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if book already exists in favourites
//         // if (userdata.favourites.includes(bookid)) {
//         //     return res.status(200).json({ message: "Book already in favourites" });
//         // }
//         if (!userdata.favourites.includes(bookObjectId)) {
//             await User.findByIdAndUpdate(id, { $push: { favourites: bookObjectId } });
//         }

//         // Add book to favourites
//         await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

//         return res.status(201).json({ message: "Book added to favourites" });

//     } catch (error) {
//         console.error("Error adding book to favourites:", error);
//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// });



// // remove favourite book 
// router.put("/deletefavouirtebook", authenticateToken, async (req, res) => {
//     try {
//         const { bookid, id } = req.headers;
//         const userdata = await User.findById(id);
//         const isBookFavourite = userdata.favourites.includes(bookid)
//         if (isBookFavourite) {
//             await User.findByIdAndDelete(id, { $pull: { favourites: bookid } });
//         }
//         res.status(200).json({
//             message: "Favourite book is remove from favourite"
//         })
//     }
//     catch (e) {
//         return res.status(500).json({
//             message: "Intrnal Error",
//         })
//     }
// });

// // get favourite book
// router.get("/getfavouritebook", authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.headers;

//         // Log headers to debug
//         console.log("Headers:", req.headers);

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User ID is required",
//             });
//         }

//         // Find user and populate favourites
//         const userData = await User.findById(id).populate("favourites");
//         console.log("User data:", userData);

//         if (!userData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const favouriteBook = userData.favourites;
//         console.log("Favourite books:", favouriteBook);

//         return res.status(200).json({
//             success: true,
//             status: "Success",
//             data: favouriteBook,
//         });
//     } catch (e) {
//         console.error("Error fetching favourite books:", e);
//         return res.status(500).json({
//             message: "Internal Error",
//             error: e.message, // Log error details
//         });
//     }
// });

const mongoose = require("mongoose"); // Make sure this is imported at the top

router.put("/addfavouritebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;
        const id = req.headers.id;

        if (!bookid || !id) {
            return res.status(400).json({ message: "Missing book ID or user ID" });
        }

        const userdata = await User.findById(id);
        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if book already exists in favourites
        if (userdata.favourites.includes(bookid)) {
            return res.status(200).json({ message: "Book already in favourites" });
        }

        // Add book to favourites
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

        return res.status(201).json({ message: "Book added to favourites" });

    } catch (error) {
        console.error("Error adding book to favourites:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// delete fav book 
// const mongoose = require("mongoose");

// router.put("/deletefavouirtebook", authenticateToken, async (req, res) => {
//     try {
//         const { bookid } = req.body; // Get bookid from request body
//         const id = req.headers.id;  // Get user ID from headers

//         if (!bookid || !id) {
//             return res.status(400).json({ message: "Missing book ID or user ID" });
//         }

//         const userdata = await User.findById(id);
//         if (!userdata) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const bookObjectId = new mongoose.Types.ObjectId(bookid); // Convert bookid to ObjectId
//         const isBookFavourite = userdata.favourites.some(fav => fav.toString() === bookid); // Compare bookid

//         if (!isBookFavourite) {
//             return res.status(400).json({ message: "Book is not in favourites" });
//         }

//         // Remove book from favourites using $pull
//         await User.findByIdAndUpdate(id, { $pull: { favourites: bookObjectId } });

//         return res.status(200).json({ message: "Favourite book removed successfully" });

//     } catch (error) {
//         console.error("Error removing favourite book:", error);
//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// });

router.put("/deletefavouirtebook", authenticateToken, async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request Headers ID:", req.headers.id);

        const { bookid } = req.body;
        const id = req.headers.id;

        if (!bookid || !id) {
            return res.status(400).json({ message: "Missing book ID or user ID" });
        }

        const userdata = await User.findById(id);
        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        const bookObjectId = new mongoose.Types.ObjectId(bookid);

        // Check if book exists in favorites
        if (!userdata.favourites.includes(bookObjectId)) {
            return res.status(400).json({ message: "Book is not in favourites" });
        }

        // Remove book from favourites
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookObjectId } });

        return res.status(200).json({ message: "Favourite book removed successfully" });

    } catch (error) {
        console.error("Error removing favourite book:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});





// get fav book 
router.get("/getfavouritebook", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const userData = await User.findById(id).populate("favourites"); // Populate to get book details

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const favouriteBooks = userData.favourites;
        return res.status(200).json({
            success: true,
            message: "Favourite books retrieved successfully",
            data: favouriteBooks,
        });
    } catch (e) {
        console.error("Error fetching favourite books:", e);
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message,
        });
    }
});





module.exports = router;