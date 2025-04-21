document.addEventListener("DOMContentLoaded", function () {
    // Example: get total from cart (optional – replace this as needed)
    const totalAmount = JSON.parse(localStorage.getItem("cart"))?.items?.reduce((sum, item) => {
      return sum + (item.productId?.price || 0) * item.quantity;
    }, 0) || 0;
  
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
  
    document.getElementById("billingForm").addEventListener("submit", function (e) {
      e.preventDefault();
  
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to continue.");
        return;
      }
  
      const billingData = {
        fullName: document.getElementById("fullName").value,
        address: document.getElementById("address").value,
        cardNumber: document.getElementById("cardNumber").value,
        expiry: document.getElementById("expiry").value,
        cvv: document.getElementById("cvv").value,
        totalAmount: parseFloat(document.getElementById("totalAmount").textContent)
      };
  
      $.ajax({
        url: "/billing",
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(billingData),
        success: function () {
          alert("Billing submitted!");
          window.location.href = "confirmation.html";
        },
        error: function (err) {
          console.error(err);
          alert("Billing failed.");
        }
      });
    });
  });
  