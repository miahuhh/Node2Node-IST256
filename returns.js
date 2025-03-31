
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
