const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const PRODUCT_FILE = 'products.json';
const CART_FILE = 'cart.json';
const ORDER_FILE = 'orders.json';
const RETURN_FILE = 'returns.json';
const connectDB = require('./db');

const Shopper = require('./models/Shopper');
const Product = require('./models/Products');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Return = require('./models/Returns');

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));

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

// === Returns helpers ===
function readReturns() {
  if (!fs.existsSync(RETURN_FILE)) return [];
  const data = fs.readFileSync(RETURN_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveReturns(returns) {
  fs.writeFileSync(RETURN_FILE, JSON.stringify(returns, null, 2));
}

app.post('/api/returns', (req, res) => {
  const returns = readReturns();
  returns.push(req.body);
  saveReturns(returns);
  res.json({ message: "Return submitted successfully." });
});

// === Product Helpers ===
function readProducts() {
  if (!fs.existsSync(PRODUCT_FILE)) return [];
  const data = fs.readFileSync(PRODUCT_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
  fs.writeFileSync(PRODUCT_FILE, JSON.stringify(products, null, 2));
}

// === Cart Helpers ===
function readCart() {
  if (!fs.existsSync(CART_FILE)) return [];
  const data = fs.readFileSync(CART_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
}

// === Order Helpers ===
function readOrders() {
  if (!fs.existsSync(ORDER_FILE)) return [];
  const data = fs.readFileSync(ORDER_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  fs.writeFileSync(ORDER_FILE, JSON.stringify(orders, null, 2));
}

// === Product Routes ===

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

// POST add product
app.post('/api/products', (req, res) => {
  const product = req.body;
  if (!product.productId || !product.description || !product.category || !product.unit || !product.price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let products = readProducts();
  const existingIndex = products.findIndex(p => p.productId === product.productId);

  if (existingIndex !== -1) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }

  saveProducts(products);
  res.json({ message: 'Product saved successfully', products });
});

// PUT update product
app.put('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const updatedProduct = req.body;
  let products = readProducts();
  const index = products.findIndex(p => p.productId === productId);

  if (index !== -1) {
    products[index] = updatedProduct;
    saveProducts(products);
    res.json({ message: 'Product updated successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// DELETE product
app.delete('/api/products/:productId', (req, res) => {
  let products = readProducts();
  products = products.filter(p => p.productId !== req.params.productId);
  saveProducts(products);
  res.json({ message: 'Product deleted successfully', products });
});

// === Cart Routes ===

// GET Cart Items
app.get('/api/cart', (req, res) => {
  const cart = readCart();
  res.json(cart);
});

// POST Add Item to Cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Missing productId or quantity' });
  }

  let cart = readCart();
  const existingIndex = cart.findIndex(c => c.productId === productId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
  res.json({ message: 'Item added to cart', cart });
});

// PUT Update Item Quantity
app.put('/api/cart/:productId', (req, res) => {
  const productId = req.params.productId;
  const { quantity } = req.body;

  let cart = readCart();
  const index = cart.findIndex(c => c.productId === productId);

  if (index !== -1) {
    cart[index].quantity = quantity;
    saveCart(cart);
    res.json({ message: 'Cart item updated', cart });
  } else {
    res.status(404).json({ message: 'Cart item not found' });
  }
});

// DELETE Remove Item from Cart
app.delete('/api/cart/:productId', (req, res) => {
  const productId = req.params.productId;
  let cart = readCart();
  cart = cart.filter(c => c.productId !== productId);
  saveCart(cart);
  res.json({ message: 'Item removed from cart', cart });
});

// === Order Routes ===

// POST Order
app.post('/api/orders', (req, res) => {
  const newOrder = req.body;

  if (!newOrder.user || !newOrder.items || !newOrder.shipping || !newOrder.total) {
    return res.status(400).json({ message: 'Incomplete order data' });
  }

  const orders = readOrders();
  orders.push(newOrder);
  saveOrders(orders);

  res.json({ message: "Order submitted successfully" });
});

// GET Orders (for admin)
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Access the website at http://localhost:${PORT}/index.html`);
});

// === Mongo test

app.get('/test', async (req, res) => {
  try {
    const shoppers = await Shopper.find(); // will return an empty array initially
    res.json({ message: 'MongoDB connected!', shoppers });
  } catch (err) {
    res.status(500).json({ error: 'MongoDB connection failed' });
  }
});
