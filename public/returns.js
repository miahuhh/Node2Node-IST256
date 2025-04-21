document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("returnForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a return.");
      return;
    }

    const returnData = {
      productName: document.getElementById("productName").value,
      productImage: document.getElementById("productImage").value,
      productPrice: parseFloat(document.getElementById("productPrice").value),
      reason: document.getElementById("reason").value,
      condition: document.getElementById("condition").value
    };

    $.ajax({
      url: "/returns",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(returnData),
      success: function () {
        alert("Return submitted!");
        window.location.href = "confirmation.html";
      },
      error: function (err) {
        console.error(err);
        alert("Failed to submit return.");
      }
    });
  });
});
