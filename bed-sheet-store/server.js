const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle signup form submission
app.post("/signup", (req, res) => {
    const newShopper = req.body;

    // Read existing data from input.json
    fs.readFile("input.json", "utf8", (err, data) => {
        let shoppers = [];
        if (!err && data) {
            shoppers = JSON.parse(data); // Parse existing JSON data
        }

        // Add the new shopper
        shoppers.push(newShopper);

        // Save updated data back to input.json
        fs.writeFile("input.json", JSON.stringify(shoppers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving data" });
            }
            res.json({ message: "Signup successful!", shoppers });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
