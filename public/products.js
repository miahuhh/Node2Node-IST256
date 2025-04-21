
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("productContainer");

  function createProductCard(product) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const card = document.createElement("div");
    card.className = "card h-100";

    const img = document.createElement("img");
    img.src = product.image || "https://via.placeholder.com/300";
    img.className = "card-img-top";
    img.alt = product.description;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = product.description;

    const category = document.createElement("p");
    category.className = "card-text";
    category.textContent = "Category: " + product.category;

    const price = document.createElement("p");
    price.className = "card-text";
    price.textContent = "Price: $" + parseFloat(product.price).toFixed(2);

    const addBtn = document.createElement("button");
    addBtn.className = "btn btn-success";
    addBtn.textContent = "Add to Cart";
    addBtn.onclick = function () {
      alert(product.description + " added to cart!");
    };

    cardBody.append(title, category, price, addBtn);
    card.append(img, cardBody);
    col.append(card);
    return col;
  }

  function displayProducts(products) {
    container.innerHTML = "";
    if (!products.length) {
      container.innerHTML = "<p>No products available.</p>";
      return;
    }

    products.forEach(product => {
      container.appendChild(createProductCard(product));
    });
  }

  fetch("/api/products")
    .then(response => response.json())
    .then(displayProducts)
    .catch(err => {
      console.error("Failed to load products:", err);
      container.innerHTML = "<p>Error loading products.</p>";
    });
});
