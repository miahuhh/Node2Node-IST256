const shoppers = JSON.parse(localStorage.getItem("shoppers")) || [];

document.getElementById("shopperForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = document.getElementById("age").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!email || !name || !age || !address) {
        alert("Please fill all required fields.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (phone && !validatePhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid age.");
        return;
    }

    const existingShopper = shoppers.find(s => s.email === email);
    if (existingShopper) {
        existingShopper.name = name;
        existingShopper.phone = phone;
        existingShopper.age = age;
        existingShopper.address = address;
    } else {
        shoppers.push({ email, name, phone, age, address });
    }

    saveShoppers();
    updateShopperTable();
    document.getElementById("shopperForm").reset();
});

function updateShopperTable() {
    const tableBody = document.getElementById("shopperTableBody");
    tableBody.innerHTML = "";
    shoppers.forEach(shopper => {
        const row = `<tr>
            <td>${shopper.email}</td>
            <td>${shopper.name}</td>
            <td>${shopper.phone ||
