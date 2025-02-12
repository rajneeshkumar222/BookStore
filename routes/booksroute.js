const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const Book = require("../model/book");
const User = require("../model/user");
const jwt = require("jsonwebtoken");


// admin ki api h isme 
// 1. book add krna 
router.post("/addbook", authenticateToken, async (req, res) => {
    try {

        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(401).json({
                message: "You are not having access to perform admin work",
            })
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,

        });
        await book.save();
        res.status(200).json({
            message: "Book addes Successfully"
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal Error",
        })
    }
})

// book ko update krna 

router.put("/upadtebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,

        });

        return res.status(200).json({
            message: "Book update successfully",
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal Error",
        })
    }
});

// book ko delete krna 

router.delete("/deletebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "Book deleted successfully",
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal Error",
        })
    }
})

// uper jitne bhi api the vo admin ka tha admin ise delete kr skta h aur add aur  update kr skta h uper diye hue id se


// ab jitni bhi api bnegi vo public ki api bnegi 
// get all books api 

router.get("/allbook", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Success",
            data: books,
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "An error occurred",
        })
    }
})

// recently added 4 book get 

router.get("/recentbook", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.status(200).json({
            message: "Success",
            data: books,
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "An error occurred",
        })
    }
})

// get book by id 



// router.get("/book/getbookbyid/:id", async (req, res) => {
//     const { id } = req.params;
//     const book = await Book.findById(id);
//     if (!book) {
//         return res.status(404).json({ message: "Book not found" });
//     }
//     return res.status(200).json({ message: "Success", data: book });
// });

router.get("/book/getbookbyid/:id", async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    console.log("Fetched book:", book); // Debug log to confirm data
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Success", data: book });
});





  


module.exports = router;