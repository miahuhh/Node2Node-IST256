$(document).ready(function () {

    // Load products on page load
    loadProducts();

    //  Handle Add/Update Product Submission
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
  
      // Basic Field Validation
      if (!productData.productId || !productData.description || !productData.category || !productData.unit || isNaN(productData.price)) {
        alert("Please fill all required fields correctly!");
        return;
      }
  
      //  Send POST request to backend to Add/Update Product
      $.ajax({
        url: 'http://localhost:3000/api/products',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function (response) {
          alert(response.message);
          loadProducts(); // Reload table
          $("#productForm")[0].reset(); // Clear form
        },
        error: function (err) {
          console.error(err);
          alert("Error saving product!");
        }
      });
    });
  
    //  Search functionality (by Product ID)
    $("#searchInput").on("keyup", function () {
      const query = $(this).val().toLowerCase();
      $("#productTable tbody tr").each(function () {
        const id = $(this).find("td:first").text().toLowerCase();
        $(this).toggle(id.includes(query));
      });
    });
  });
  
  //  Function: Load products from backend
  function loadProducts() {
    $.get('http://localhost:3000/api/products', function (products) {
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
            <button class="btn btn-danger btn-sm" onclick='deleteProduct("${product.productId}")'>Delete</button>
          </td>
        </tr>`;
        tbody.append(row);
      });
    });
  }
  
  //  Function: Delete product
  function deleteProduct(productId) {
    $.ajax({
      url: `http://localhost:3000/api/products/${productId}`,
      method: 'DELETE',
      success: function (response) {
        alert(response.message);
        loadProducts(); // Reload table
      },
      error: function (err) {
        console.error(err);
        alert("Error deleting product!");
      }
    });
  }
  