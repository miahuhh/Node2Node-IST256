const app = angular.module('shippingApp', []);

app.controller('ShippingController', function ($scope, $http, $timeout) {
  $scope.products = [];
  $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
  $scope.shippingCost = 9.99;
  $scope.total = 0;
  $scope.orderSubmitted = false;

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
  
    $timeout(function () {
      $scope.renderCartSummary();
    });
  });

  // Calculate totals and build order items
  $scope.renderCartSummary = function () {
    let total = 0;
    $scope.order.items = $scope.cart.map(item => {
        const product = $scope.products.find(p => p.productId === item.productId);
        if (!product) return null;
      
        const subtotal = product.price * item.quantity;
        total += subtotal;
      
        return {
          productId: product.productId,
          description: product.description,
          quantity: item.quantity,
          price: product.price
        };
      }).filter(Boolean);
    $scope.total = total + $scope.shippingCost;
    $scope.order.total = $scope.total;
  };

  // Submit Order
  $scope.submitOrder = function () {
    // Add shipping info from form fields
    $scope.order.shipping.address = {
      country: $scope.shippingCountry,
      street: $scope.shippingAddress,
      city: $scope.shippingCity,
      state: $scope.shippingState,
      postal: $scope.shippingPostal
    };

    // Show JSON preview
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
  };
});