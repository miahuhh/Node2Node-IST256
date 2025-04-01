const app = angular.module('shippingApp', []);

app.controller('ShippingController', function ($scope, $http, $timeout) {
  $scope.products = [];
  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
  $scope.shippingCost = 9.99;
  $scope.total = 0;
  $scope.orderSubmitted = false;
  
  // Add validation properties
  $scope.formSubmitted = false;
  $scope.errors = {};

  $scope.order = {
    user: {},
    shipping: {
      carrier: '',
      method: ''
    },
    payment: {},
    items: [],
    total: 0
  };

  // Load products
  $http.get("http://localhost:3000/api/products").then(function (response) {
    $scope.products = response.data;
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || []; 
    $timeout(function () {
      $scope.renderCartSummary();
    });
  });

  // Calculate totals and build order items
  $scope.renderCartSummary = function () {
    let subtotal = 0;
    $scope.order.items = $scope.cart.map(item => {
      const product = $scope.products.find(p => p.productId === item.productId);
      if (!product) return null;
  
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
  
      return {
        productId: product.productId,
        description: product.description,
        quantity: item.quantity,
        price: product.price,
        image: product.image || 'https://via.placeholder.com/300'
      };
    }).filter(Boolean);
  
    $scope.subtotal = subtotal; 
    $scope.total = subtotal + $scope.shippingCost;
    $scope.order.total = $scope.total;
  };

  // Generate a random order number
  $scope.generateOrderNumber = function() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${randomDigits}`;
  };

  // Form Validation
  $scope.validate = function() {
    $scope.errors = {};
    let valid = true;
    
    // Get form values
    const fullName = $("#fullName").val().trim();
    const contactInfo = $("#contactInfo").val().trim();
    const country = $("#country").val().trim();
    const address = $("#address").val().trim();
    const city = $("#city").val().trim();
    const state = $("#state").val().trim();
    const postal = $("#postal").val().trim();
    const cardNumber = $("#cardNumber").val().trim();
    const cardExpiry = $("#cardExpiry").val().trim();
    const cardCVV = $("#cardCVV").val().trim();
    const cardName = $("#cardName").val().trim();
    
    // Empty field validation
    if (!fullName) { $scope.errors.fullName = "Please enter your full name"; valid = false; }
    if (!contactInfo) { $scope.errors.contactInfo = "Please enter your contact information"; valid = false; }
    if (!country) { $scope.errors.country = "Please enter your country"; valid = false; }
    if (!address) { $scope.errors.address = "Please enter your address"; valid = false; }
    if (!city) { $scope.errors.city = "Please enter your city"; valid = false; }
    if (!state) { $scope.errors.state = "Please enter your state/province"; valid = false; }
    if (!postal) { $scope.errors.postal = "Please enter your postal code"; valid = false; }
    if (!cardNumber) { $scope.errors.cardNumber = "Please enter your card number"; valid = false; }
    if (!cardExpiry) { $scope.errors.cardExpiry = "Please enter card expiration date"; valid = false; }
    if (!cardCVV) { $scope.errors.cardCVV = "Please enter card security code"; valid = false; }
    if (!cardName) { $scope.errors.cardName = "Please enter the name on your card"; valid = false; }
    if (!$scope.order.shipping.carrier) { $scope.errors.carrier = "Please select a shipping carrier"; valid = false; }
    if (!$scope.order.shipping.method) { $scope.errors.method = "Please select a shipping method"; valid = false; }
    
    // Specific field validations (only if not empty)
    if (fullName && /\d/.test(fullName)) { 
      $scope.errors.fullName = "Name cannot contain numbers"; 
      valid = false; 
    }
    
    if (cardNumber && !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) { 
      $scope.errors.cardNumber = "Card number must be 16 digits"; 
      valid = false; 
    }
    
    if (cardExpiry && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) { 
      $scope.errors.cardExpiry = "Expiration date must be in MM/YY format"; 
      valid = false; 
    }
    
    if (cardCVV && !/^\d{3,4}$/.test(cardCVV)) { 
      $scope.errors.cardCVV = "CVV must be 3 or 4 digits"; 
      valid = false; 
    }
    
    if (cardName && /\d/.test(cardName)) { 
      $scope.errors.cardName = "Name on card cannot contain numbers"; 
      valid = false; 
    }
    
    return valid;
  };

  // Submit Order
  $scope.submitOrder = function () {
    $scope.formSubmitted = true;
    
    // Validate the form
    if (!$scope.validate()) {
      // Scroll to the first error
      const firstError = document.querySelector('.is-invalid');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    
    // Generate order number
    const orderNumber = $scope.generateOrderNumber();
    $scope.order.orderNumber = orderNumber;
    
    // Save order number to localStorage for confirmation page
    localStorage.setItem("orderNumber", orderNumber);
    
    // Add shipping info from form fields
    $scope.order.shipping.address = {
      country: $("#country").val().trim(),
      street: $("#address").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      postal: $("#postal").val().trim()
    };

    // Add user info
    $scope.order.user = {
      name: $("#fullName").val().trim(),
      contact: $("#contactInfo").val().trim()
    };
    
    // Add payment info
    const cardNumber = $("#cardNumber").val().trim();
    $scope.order.payment = {
      cardLast4: cardNumber.slice(-4),
      cardName: $("#cardName").val().trim(),
      cardExpiry: $("#cardExpiry").val().trim()
    };

    $("#orderOutput").removeClass("d-none").text(JSON.stringify($scope.order, null, 2));
    $scope.orderSubmitted = true;

    // Submit to backend
    $http.post("http://localhost:3000/api/orders", $scope.order)
      .then(function () {
        alert("Order submitted successfully!");
        localStorage.removeItem("cart");
        window.location.href = "confirmation.html";
      })
      .catch(function (err) {
        console.error(err);
        alert("Failed to submit order.");
      });
      
    return true;
  };
});