const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// Apply CORS middleware before defining routes
// const cors = require('cors');

const corsOptions = {
    origin: "https://dynamic-croissant-d0dd4e.netlify.app",  // Replace with your frontend URL ✅
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "id", "bookid"],  
};

app.use(cors(corsOptions));
app.use(express.json());

// Create routes
const PORT = process.env.PORT || 4002;

// Connect with the database
require("./config/database").dbConnect();

const bookroutes = require("./routes/userroute");
app.use("/api/v1", bookroutes);
const book = require("./routes/booksroute");
app.use("/api/v1", book);
const favourite = require("./routes/favourites");
app.use("/api/v1", favourite);
const cart = require("./routes/cartrouter");
app.use("/api/v1", cart);
const order = require("./routes/orderroute");
app.use("/api/v1", order);

// Test route
app.get("/", (req, res) => {
    res.send("Kare Kalua");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
