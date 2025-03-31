const app = angular.module('returnsApp', []);

app.controller('ReturnsController', function($scope, $http) {
  $scope.returnData = {
    email: '',
    returns: []
  };

  $scope.findOrders = function() {
    if (!$scope.returnData.email) {
      alert("Please enter your email.");
      return;
    }

    $http.get('/api/orders').then(function(response) {
      const allOrders = response.data;
      const matchedItems = [];

      allOrders.forEach(order => {
        if (order.user.contact === $scope.returnData.email) {
          order.items.forEach(item => {
            matchedItems.push({
              productId: item.productId,
              reason: ''
            });
          });
        }
      });

      if (matchedItems.length === 0) {
        alert("No orders found for this email.");
      } else {
        $scope.returnData.returns = matchedItems;
      }
    });
  };

  $scope.removeItem = function(index) {
    $scope.returnData.returns.splice(index, 1);
  };

  $scope.submitReturn = function() {
    $scope.returnData.date = new Date().toISOString();
    $http.post('/api/returns', $scope.returnData).then(function(response) {
      alert("Return submitted successfully.");
      $scope.returnData.returns = [];
    }, function(error) {
      alert("Error submitting return.");
    });
  };
});
