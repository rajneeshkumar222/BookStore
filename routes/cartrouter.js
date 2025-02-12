const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");
const Book = require("../model/book");
const User = require("../model/user");
const { route } = require("./favourites");

// put book to cart
// router.put("/addtocart", authenticateToken, async (req, res) => {
//     try {
//         const { bookid, id } = req.headers;

//         // Find user by ID
//         const userdata = await User.findById(id);
//         if (!userdata) {
//             return res.status(404).json({
//                 message: "User not found",
//                 status: "error",
//             });
//         }

//         // Check if the book is already in the cart
//         const isBookInCart = userdata.cart.includes(bookid);
//         if (isBookInCart) {
//             return res.status(200).json({
//                 message: "Book is already in the cart",
//                 status: "success",
//             });
//         }

//         // Add the book to the cart
//         await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

//         return res.status(200).json({
//             status: "success",
//             message: "Book added to the cart",
//         });
//     } catch (e) {
//         console.error(e);
//         return res.status(500).json({
//             message: "An error occurred",
//         });
//     }
// });

router.put("/addtocart", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.body;  // ✅ Extract from body
        const { id } = req.headers;   // ✅ Extract user ID from headers

        if (!id || !bookid) {
            return res.status(400).json({
                message: "User ID and Book ID are required",
                status: "error",
            });
        }

        // Find the user
        const userdata = await User.findById(id);
        if (!userdata) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }

        // Check if the book is already in the cart
        if (userdata.cart.includes(bookid)) {
            return res.status(200).json({
                message: "Book is already in the cart",
                status: "success",
            });
        }

        // ✅ Correctly update user document
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { cart: bookid } },
            { new: true }  // ✅ Ensure updated user document is returned
        );

        return res.status(200).json({
            status: "success",
            message: "Book added to the cart",
            cart: updatedUser.cart, // ✅ Return updated cart
        });
    } catch (e) {
        console.error("Error adding to cart:", e);
        return res.status(500).json({
            message: "An error occurred",
            error: e.message, // ✅ Log the actual error
        });
    }
});


// remove from the cart

// router.put("/removefromcart/:id",authenticateToken,async(req,res)=>{
//     try{

//         const {bookid,id}=req.headers;
//         await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
//         return res.status(201).json({
//             message: "Book reomved from cart",
//             status: "success",
//         });

//     }

//     catch(e){
//         return res.status(404).json({
//             message: "An error Occurred",
            
//         });
//     }
// });

router.put("/removefromcart/:bookid", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id;  
        const { bookid } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: bookid } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Book removed from cart",
            status: "success",
            cart: user.cart || [],  // ✅ Ensure cart is always an array
        });

    } catch (e) {
        return res.status(500).json({
            message: "An error occurred",
            error: e.message,
        });
    }
});



// get a cart of particcular user
// router.get("/getusercart", authenticateToken, async (req, res) => {
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
//         const userData = await User.findById(id).populate("cart");
//         console.log("User data:", userData);

//         if (!userData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const cart = userData.cart.reverse();

//         return res.status(200).json({
//             success: true,
//             status: "Success",
//             data: cart,
//         });
//     } catch (e) {
//         console.error("Error getting cart book:", e);
//         return res.status(500).json({
//             message: "Internal Error",
//             error: e.message, // Log error details
//         });
//     }
// });

router.get("/getusercart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // ✅ Populate book details
        const userData = await User.findById(id).populate("cart");
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart: userData.cart, // ✅ Correct return
        });
    } catch (e) {
        console.error("Error getting cart:", e);
        return res.status(500).json({
            message: "Internal Error",
            error: e.message,
        });
    }
});




module.exports=router;