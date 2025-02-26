document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    const shopperData = {
        email: document.getElementById("email").value.trim(),
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        age: document.getElementById("age").value.trim(),
        address: document.getElementById("address").value.trim()
    };

    // Validate email
    if (!shopperData.email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
    }

    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopperData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        document.getElementById("signupForm").reset(); // Clear form
    })
    .catch(error => console.error("Error:", error));
});