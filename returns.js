
const app = angular.module('returnsApp', []);

app.controller('ReturnsController', function($scope, $http) {
  $scope.returnData = {
    email: '',
    orderId: '',
    returns: []
  };

  $scope.addItem = function() {
    $scope.returnData.returns.push({ productId: '', reason: '' });
  };

  $scope.removeItem = function(index) {
    $scope.returnData.returns.splice(index, 1);
  };

  $scope.submitReturn = function() {
    $scope.returnData.date = new Date().toISOString();
    $http.post('/api/returns', $scope.returnData).then(function(response) {
      alert("Return submitted successfully.");
    }, function(error) {
      alert("Error submitting return.");
    });
  };
});

$scope.findOrder = function () {
  if (!$scope.returnData.email || !$scope.returnData.orderId) {
    alert("Enter both email and order ID");
    return;
  }

  $http.get('/api/orders').then(function (response) {
    const match = response.data.find(o =>
      o.user.contact === $scope.returnData.email &&
      o.orderId === $scope.returnData.orderId
    );

    if (match) {
      $scope.returnData.returns = match.items.map(i => ({
        productId: i.productId,
        reason: ''
      }));
    } else {
      alert("No matching order found.");
    }
  });
};
