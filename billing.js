
const app = angular.module('billingApp', []);

app.controller('BillingController', function($scope, $http) {
  $scope.searchQuery = '';
  $scope.billingData = null;

  $scope.lookupBilling = function() {
    $http.get('/api/orders').then(function(response) {
      const orders = response.data;
      const match = orders.find(o => 
        o.user.contact === $scope.searchQuery || 
        o.orderId === $scope.searchQuery
      );
      $scope.billingData = match || null;
      if (!match) alert("No billing record found.");
    });
  };
});
