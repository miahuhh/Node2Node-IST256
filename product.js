let products = [];
let editMode = false;
let editingProductId = null;

$(document).ready(function () {
  loadProducts();

  // Form submission for Add/Update
  $("#productForm").on("submit", function (e) {
    e.preventDefault();

    const productData = {
      productId: $("#productId").val().trim(),
      description: $("#productDescription").val().trim(),
      category: $("#productCategory").val().trim(),
      unit: $("#productUnit").val().trim(),
      price: parseFloat($("#productPrice").val().trim()),
      weight: $("#productWeight").val().trim()
    };

    // Basic validation
    if (!productData.productId || !productData.description || !productData.category || !productData.unit || isNaN(productData.price)) {
      alert("Please fill all required fields correctly!");
      return;
    }

    if (editMode) {
      // PUT request for updating
      $.ajax({
        url: `http://localhost:3000/api/products/${editingProductId}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function (response) {
          alert(response.message);
          resetForm();
          loadProducts();
        },
        error: function (err) {
          console.error(err);
          alert("Error updating product!");
        }
      });
    } else {
      // POST request for new product
      $.ajax({
        url: 'http://localhost:3000/api/products',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function (response) {
          alert(response.message);
          resetForm();
          loadProducts();
        },
        error: function (err) {
          console.error(err);
          alert("Error saving product!");
        }
      });
    }
  });

  // Search functionality
  $("#searchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    $("#productTable tbody tr").each(function () {
      const id = $(this).find("td:first").text().toLowerCase();
      $(this).toggle(id.includes(query));
    });
  });
});

// Load products from backend
function loadProducts() {
  $.get('http://localhost:3000/api/products', function (data) {
    products = data;
    updateProductTable();
  });
}

// Populate product table
function updateProductTable() {
  const tbody = $("#productTable tbody");
  tbody.empty();

  products.forEach(product => {
    const row = `<tr>
      <td>${product.productId}</td>
      <td>${product.description}</td>
      <td>${product.category}</td>
      <td>${product.unit}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.weight || "-"}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick='editProduct("${product.productId}")'>Edit</button>
        <button class="btn btn-danger btn-sm" onclick='deleteProduct("${product.productId}")'>Delete</button>
      </td>
    </tr>`;
    tbody.append(row);
  });
}

// Edit product
function editProduct(productId) {
  const product = products.find(p => p.productId === productId);
  if (product) {
    $("#productId").val(product.productId);
    $("#productDescription").val(product.description);
    $("#productCategory").val(product.category);
    $("#productUnit").val(product.unit);
    $("#productPrice").val(product.price);
    $("#productWeight").val(product.weight);

    editingProductId = productId;
    editMode = true;
  }
}

// Delete product
function deleteProduct(productId) {
  $.ajax({
    url: `http://localhost:3000/api/products/${productId}`,
    method: 'DELETE',
    success: function (response) {
      alert(response.message);
      loadProducts();
    },
    error: function (err) {
      console.error(err);
      alert("Error deleting product!");
    }
  });
}

// Reset form after submission/edit
function resetForm() {
  $("#productForm")[0].reset();
  editMode = false;
  editingProductId = null;
}