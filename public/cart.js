
let products = [];
let cart = [];

$(document).ready(function () {
  // GET Products
  $.get('/products', function (data) {
    products = data;

    // Show empty cart message
    $("#productList").html(`
      <div class="col-12 text-center" id="emptyCartMessage">
        <div class="alert alert-info">
          <h4>No items added yet.</h4>
          <p>Please navigate over to products or use the search bar to peruse our catalog of bed sheets for one that you like!</p>
        </div>
      </div>
    `);

    loadCart();
  });

  // Search filter
  $("#searchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();

    if (query.length > 0) {
      const filtered = products.filter(p =>
        p.productId.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      displayProducts(filtered);
    } else {
      $("#productList").empty();
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

  $("#checkoutBtn").on("click", function () {
    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    window.location.href = "shipping.html";
  });
});

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

function addToCart(productId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to add to cart.");
    return;
  }

  const product = products.find(p => p._id === productId);
  if (!product) return;

  $.ajax({
    url: '/cart',
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
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

function loadCart() {
  const token = localStorage.getItem("token");
  if (!token) return;

  $.ajax({
    url: '/cart',
    method: 'GET',
    headers: { "Authorization": `Bearer ${token}` },
    success: function (data) {
      cart = data || { items: [] };
      updateCartTable();
      if (cart.items.length > 0) {
        $("#emptyCartMessage").hide();
      }
    },
    error: function (err) {
      console.error(err);
    }
  });
}

function updateCartTable() {
  // Implement cart table update logic as needed
}
