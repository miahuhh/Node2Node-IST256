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

// Orders Endpoint
const ORDER_FILE = 'orders.json';

function readOrders() {
  if (!fs.existsSync(ORDER_FILE)) return [];
  const data = fs.readFileSync(ORDER_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  fs.writeFileSync(ORDER_FILE, JSON.stringify(orders, null, 2));
}

// POST Order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  let orders = readOrders();
  orders.push(order);
  saveOrders(orders);
  res.json({ message: "Order submitted successfully." });
});

// GET Orders (for admin)
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});