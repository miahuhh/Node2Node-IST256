let products = [];
let cart = [];

// Load products on page load
$(document).ready(function () {
  // GET Products
  $.get('http://localhost:3000/api/products', function (data) {
    products = data;
    displayProducts(products);

    // Load cart from server (GET cart)
    loadCart();
  });

  // Search filter
  $("#searchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    const filtered = products.filter(p => 
      p.productId.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
    displayProducts(filtered);
  });

  // checkout functionality
  $("#checkoutBtn").on("click", function() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    const currentUser = localStorage.getItem("currentUser") || "Guest";
    
    const order = {
      user: currentUser,
      items: cart,
      orderDate: new Date().toISOString(),
      total: cart.reduce((total, item) => {
        const product = products.find(p => p.productId === item.productId);
        return total + (product.price * item.quantity);
      }, 0)
    };
    
    // send order to server
    $.ajax({
      url: 'http://localhost:3000/api/orders',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(order),
      success: function(response) {
        // clear the cart on server
        cart.forEach(item => {
          $.ajax({
            url: `http://localhost:3000/api/cart/${item.productId}`,
            method: 'DELETE'
          });
        });
        
        // clear localStorage cart
        localStorage.setItem("cart", "[]");
        
        // show success message and redirect
        $("#checkoutMessage").text("Order placed successfully! Redirecting to confirmation page...");
        setTimeout(() => {
          window.location.href = "confirmation.html";
        }, 2000);
      },
      error: function(err) {
        console.error(err);
        alert("Error processing your order. Please try again.");
      }
    });
  });
});

// Display products
function displayProducts(productList) {
  const container = $("#productList");
  container.empty();

  productList.forEach(product => {
    const card = `<div class="col-md-4">
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${product.description}</h5>
          <p class="card-text">Category: ${product.category}</p>
          <p class="card-text">Price: $${product.price.toFixed(2)}</p>
          <button class="btn btn-success" onclick='addToCart("${product.productId}")'>Add to Cart</button>
        </div>
      </div>
    </div>`;
    container.append(card);
  });
}

// Add to cart (POST)
function addToCart(productId) {
  const product = products.find(p => p.productId === productId);
  if (!product) return;

  $.ajax({
    url: 'http://localhost:3000/api/cart',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId: productId, quantity: 1 }),
    success: function (response) {
      alert("Added to cart!");
      loadCart();
    },
    error: function (err) {
      console.error(err);
      alert("Error adding to cart!");
    }
  });
}

// Load cart items (GET)
function loadCart() {
  $.get('http://localhost:3000/api/cart', function (data) {
    cart = data;
    updateCartTable();
  });
}

// Update cart table
function updateCartTable() {
  const tbody = $("#cartTable tbody");
  tbody.empty();
  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.productId === item.productId);
    const itemTotal = item.quantity * product.price;
    total += itemTotal;

    const row = `<tr>
      <td>${product.description}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" style="width:60px" 
        onchange='updateQuantity("${item.productId}", this.value)'>
      </td>
      <td>$${product.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick='removeFromCart("${item.productId}")'>Remove</button></td>
    </tr>`;
    tbody.append(row);
  });

  $("#cartTotal").text(`Total: $${total.toFixed(2)}`);
}

// Update quantity (PUT)
function updateQuantity(productId, newQty) {
  newQty = parseInt(newQty);
  if (newQty <= 0) return;

  $.ajax({
    url: `http://localhost:3000/api/cart/${productId}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({ quantity: newQty }),
    success: function (response) {
      alert("Quantity updated!");
      loadCart();
    },
    error: function (err) {
      console.error(err);
      alert("Error updating quantity!");
    }
  });
}

// Remove from cart (DELETE)
function removeFromCart(productId) {
  $.ajax({
    url: `http://localhost:3000/api/cart/${productId}`,
    method: 'DELETE',
    success: function (response) {
      alert("Item removed!");
      loadCart();
    },
    error: function (err) {
      console.error(err);
      alert("Error removing item!");
    }
  });
}