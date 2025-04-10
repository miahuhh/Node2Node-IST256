// Load stored shoppers from localStorage or initialize an empty array
const shoppers = JSON.parse(localStorage.getItem("shoppers")) || [];

// Ensure shopper list is displayed on page load
document.addEventListener("DOMContentLoaded", updateShopperTable);

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

    // Check if shopper already exists
    const existingShopperIndex = shoppers.findIndex(s => s.email === email);
    if (existingShopperIndex !== -1) {
        // Update existing shopper
        shoppers[existingShopperIndex] = { email, name, phone, age, address };
    } else {
        // Add new shopper
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
            <td>${shopper.phone || "-"}</td>
            <td>${shopper.age}</td>
            <td>${shopper.address}</td>
            <td><button class='btn btn-danger btn-sm' onclick='deleteShopper("${shopper.email}")'>Delete</button></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function deleteShopper(email) {
    const index = shoppers.findIndex(s => s.email === email);
    if (index !== -1) {
        shoppers.splice(index, 1);
        saveShoppers();
        updateShopperTable();
    }
}

// Save shopper list to localStorage
function saveShoppers() {
    localStorage.setItem("shoppers", JSON.stringify(shoppers));
}

console.log("Entered Email:", email);
if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
}
// Validate email format
function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(email);
}

// Validate phone format (10-digit number)
function validatePhone(phone) {
    return /^\\d{10}$/.test(phone);
}

// Load saved shoppers on page load
updateShopperTable();
