let products = [];
let cart = [];

// Load products on page load
$(document).ready(function () {
  // GET Products
  $.get('/products', function (data) {
    products = data;
    // Don't display products initially
    
    // Add empty cart message to the product list area
    $("#productList").html(`
      <div class="col-12 text-center" id="emptyCartMessage">
        <div class="alert alert-info">
          <h4>No items added yet.</h4>
          <p>Please navigate over to products or use the search bar to peruse our catalog of bed sheets for one that you like!</p>
        </div>
      </div>
    `);

    // Load cart from server (GET cart)
    loadCart();
  });

  // Search filter
  $("#searchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    
    // Only show products when user is actively searching
    if (query.length > 0) {
      const filtered = products.filter(p => 
        p.productId.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
      displayProducts(filtered);
    } else {
      // Clear product display when search is empty
      $("#productList").empty();
      
      // Show empty cart message if needed
      if (cart.items.length === 0) {
        $("#productList").html(`
          <div class="col-12 text-center" id="emptyCartMessage">
            <div class="alert alert-info">
              <h4>No items added yet.</h4>
              <p>Please navigate over to products or use the search bar to peruse our catalog of bed sheets for one that you like!</p>
            </div>
          </div>
        `);
      }
    }
  });

 // Proceed to shipping page instead of submitting order directly
$("#checkoutBtn").on("click", function () {
  if (cart.items.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Save cart to localStorage for access on shipping.html
  localStorage.setItem("cart", JSON.stringify(cart));

  // Redirect to shipping selection page
  window.location.href = "shipping.html";
});
  
});

// Display products
function displayProducts(productList) {
  const container = $("#productList");
  container.empty();

  if (productList.length === 0) {
    container.html(`
      <div class="col-12 text-center">
        <p>No matching products found.</p>
      </div>
    `);
    return;
  }

  productList.forEach(product => {
    const card = `<div class="col-md-4">
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${product.description}</h5>
          <p class="card-text">Category: ${product.category}</p>
          <p class="card-text">Price: $${product.price.toFixed(2)}</p>
          <button class="btn btn-success" onclick='addToCart("${product._id}")'>Add to Cart</button>
        </div>
      </div>
    </div>`;
    container.append(card);
  });
}

// Add to cart (POST)
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (!product) return;

  
  // Sync to backend MongoDB cart
  fetch("/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: productId, quantity: 1 })
  }).then(res => res.json()).then(console.log).catch(console.error);
// Update localStorage cart manually
  let localCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = localCart.find(item => item._id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    localCart.push({ productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(localCart));

  // Send to server too
  $.ajax({
    url: '/cart',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId: productId, quantity: 1 }),
    success: function (response) {
      alert("Added to cart!");
      $("#searchInput").val('');
      $("#productList").empty();
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
  $.get('/cart', function (data) {
    cart = data || { items: [] };
    updateCartTable();
    
    // Hide empty cart message if there are items in the cart
    if (cart.items.length > 0) {
      $("#emptyCartMessage").hide();
    } else {
      // If the search field is empty, show the empty cart message
      if ($("#searchInput").val().trim() === '') {
        $("#productList").html(`
          <div class="col-12 text-center" id="emptyCartMessage">
            <div class="alert alert-info">
              <h4>No items added yet.</h4>
              <p>Please navigate over to products or use the search bar to peruse our catalog of bed sheets for one that you like!</p>
            </div>
          </div>
        `);
      }
    }
  });
}

// Update cart table
function updateCartTable() {
  const tbody = $("#cartTable tbody");
  tbody.empty();
  let total = 0;

  cart.items.forEach(item => {
    const product = products.find(p => p._id === item.productId);
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
    url: `/cart/${productId}`,
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
    url: `/cart/${productId}`,
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