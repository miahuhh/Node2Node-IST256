const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
const connectDB = require("./db");
connectDB();

// Models
const Shopper = require("./models/Shopper");
const Product = require("./models/Products");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const Return = require("./models/Returns");

// Routes
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const shippingRoutes = require("./routes/shipping");
const billingRoutes = require("./routes/billing");
const returnRoutes = require("./routes/returns");

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/shipping", shippingRoutes);
app.use("/billing", billingRoutes);
app.use("/returns", returnRoutes);

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Access the website at http://localhost:${PORT}/index.html`);
});
