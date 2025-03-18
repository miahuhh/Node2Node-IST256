let products = [];
let cart = [];

cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartTable();
updateCartCount();
$(document).ready(function () {
  //  Load products from backend
  $.get('http://localhost:3000/api/products', function (data) {
    products = data;
    displayProducts(products);
  });

  //  Search functionality
  $("#searchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    const filtered = products.filter(p => 
      p.productId.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
    displayProducts(filtered);
  });
});

//  Display products
function displayProducts(productList) {
  const container = $("#productList");
  container.empty();

  productList.forEach(product => {
    const card = `<div class="col-md-4">
      <div class="card">
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

//  Add to cart
function addToCart(productId) {
  const product = products.find(p => p.productId === productId);
  const cartItem = cart.find(c => c.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartTable();
  updateCartCount();
}

//  Remove item
function removeFromCart(productId) {
  cart = cart.filter(c => c.productId !== productId);
  updateCartTable();
  updateCartCount();
}

//  Update cart table
function updateCartTable() {
  const tbody = $("#cartTable tbody");
  tbody.empty();
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const row = `<tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick='removeFromCart("${item.productId}")'>Remove</button></td>
    </tr>`;
    tbody.append(row);
  });

  $("#cartTotal").text(`Total: $${total.toFixed(2)}`);
}

//update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").text(count);
}

// Checkout button click
$("#checkoutBtn").on("click", function () {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Prepare order data
  const order = {
    user: currentUser || "guest",  // Later can link to logged-in user
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    date: new Date().toISOString()
  };
  const currentUser = localStorage.getItem("currentUser") || "guest";


  // Send order to backend
  $.ajax({
    url: "http://localhost:3000/api/orders",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(order),
    success: function (response) {
      // Clear cart
      cart = [];
      localStorage.removeItem("cart");
      updateCartTable();
      updateCartCount();
    
      // Redirect to confirmation page
      window.location.href = "confirmation.html";
    },
    error: function (err) {
      alert("Error processing order.");
      console.error(err);
    }
  });
});



// Save cart to localStorage whenever it changes
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Modify addToCart and removeFromCart:
function addToCart(productId) {
  const product = products.find(p => p.productId === productId);
  const cartItem = cart.find(c => c.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartTable();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.productId !== productId);
  saveCart();
  updateCartTable();
}
