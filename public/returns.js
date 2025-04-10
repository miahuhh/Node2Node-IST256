const app = angular.module('returnsApp', []);

app.controller('ReturnsController', function($scope, $http) {
  $scope.email = '';
  $scope.returnItems = [];

  $scope.findOrders = function () {
    if (!$scope.email) {
      alert("Please enter your email.");
      return;
    }

    $http.get('/orders').then(function (response) {
      const orders = response.data;
      let found = false;
      $scope.returnItems = [];

      orders.forEach(order => {
        if (order.user.contact === $scope.email) {
          found = true;
          order.items.forEach(item => {
            $scope.returnItems.push({
              productId: item.productId,
              name: item.description,
              price: item.price,
              image: item.image || 'https://via.placeholder.com/300',
              reason: '',
              condition: ''
            });
          });
        }
      });

      if (!found) {
        alert("No orders found for this email.");
      }
    });
  };

  $scope.submitReturn = function () {
    const incomplete = $scope.returnItems.some(item => !item.reason || !item.condition);
    if (incomplete) {
      alert("Please fill out reason and condition for each product.");
      return;
    }

    const returnPayload = {
      email: $scope.email,
      returns: $scope.returnItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        reason: item.reason,
        condition: item.condition
      })),
      submittedAt: new Date().toISOString()
    };

    $http.post('/returns', returnPayload).then(function () {
      alert("Return submitted successfully.");
      $scope.returnItems = [];
    }, function () {
      alert("Error submitting return.");
    });
  };
});
