const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const PRODUCT_FILE = 'products.json';
const CART_FILE = 'cart.json'; // NEW FILE for cart storage

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

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

// === Product Routes ===

// GET all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
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

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});