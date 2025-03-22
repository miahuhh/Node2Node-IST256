const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

//static file serving
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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

// PRODUCT ENDPOINTS
const PRODUCT_FILE = 'products.json';

function readProducts() {
  if (!fs.existsSync(PRODUCT_FILE)) {
    return [];
  }
  const data = fs.readFileSync(PRODUCT_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
  fs.writeFileSync(PRODUCT_FILE, JSON.stringify(products, null, 2));
}

// GET all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.productId === req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// POST (add or update) product
app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  let products = readProducts();
  
  // Check if product with this ID already exists
  const index = products.findIndex(p => p.productId === newProduct.productId);
  
  if (index !== -1) {
    // Update existing product
    products[index] = newProduct;
    saveProducts(products);
    res.json({ message: "Product updated successfully" });
  } else {
    // Add new product
    products.push(newProduct);
    saveProducts(products);
    res.json({ message: "Product added successfully" });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  let products = readProducts();
  const initialLength = products.length;
  
  products = products.filter(p => p.productId !== req.params.id);
  
  if (products.length < initialLength) {
    saveProducts(products);
    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Access the website at http://localhost:${PORT}/index.html`);
});