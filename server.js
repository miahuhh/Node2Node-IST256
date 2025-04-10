const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Load environment variables

const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection + Server Start
(async () => {
  try {
    await connectDB(); // ensure DB connection before starting server
    // Routes
    app.use("/products", require("./routes/products"));
    app.use("/cart", require("./routes/cart"));
    app.use("/shipping", require("./routes/shipping"));
    app.use("/billing", require("./routes/billing"));
    app.use("/returns", require("./routes/returns"));

    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/index.html`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
})();