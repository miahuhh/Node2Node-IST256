document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("shippingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit shipping info.");
      return;
    }

    const shippingData = {
      fullName: document.getElementById("fullName").value,
      address: document.getElementById("address").value,
      carrier: document.getElementById("carrier").value,
      method: document.getElementById("method").value
    };

    $.ajax({
      url: "/shipping",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: JSON.stringify(shippingData),
      success: function () {
        alert("Shipping info submitted!");
        window.location.href = "confirmation.html";
      },
      error: function (err) {
        console.error(err);
        alert("Shipping failed.");
      }
    });
  });
});
