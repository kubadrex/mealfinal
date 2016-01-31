'use strict';

var DELIVERY_PRICE = 500;

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition']) .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) { }]).directive('carousel', [function() { return { } }]);

angular.module('core').constant('clientTokenPath', '/braintree/client_token');

angular.module('core').controller('CheckoutCtrl', ['$scope', '$window', '$http', '$state', '$timeout', 'ngCart', 'Authentication',
  function($scope, $window, $http, $state, $timeout, ngCart, Authentication) {
    $scope.errors = '';
    $scope.user = Authentication.user;
    $scope.deliveryType = '1';
    $scope.paymentType = '1';
    $scope.emptyBasket = ngCart.getTotalItems() === 0 ? true : false;
    ngCart.setShipping(0);

    $scope.paymentOptions = {
      onPaymentMethodReceived: function(payload) {
        var order = prepareOrder(payload);
      }
  	};

    $scope.update = function() {
      prepareOrder({
        type: 'PaymentOnCollection'
      });

      return false;
    }

    $scope.$watch('deliveryType', function(newVal, oldVal) {
      if (!newVal || newVal === oldVal) return;

      if (newVal === '0') {
        ngCart.setShipping(DELIVERY_PRICE);
      } else {
        ngCart.setShipping(0);
      }
    });

    $scope.$on('ngCart:change', function (event, data) {
      $scope.emptyBasket = ngCart.getTotalItems() === 0 ? true : false;
    });

    function prepareOrder(payload) {
      angular.extend(payload, ngCart.toObject());
      payload.total = payload.totalCost;

      var deliveryDetails = {};
      if ($scope.deliveryType === '0') {
        deliveryDetails.shippingType = 'delivery';
        deliveryDetails.shippingAddress =
          $scope.user.adress + ', ' + $scope.user.postcode + ', ' + $scope.user.city + ', ' + $scope.user.phone ;
      } else {
        deliveryDetails.shippingType = 'collection';
        deliveryDetails.shippingAddress = 'Collect in our restaurant';
      }

      angular.extend(payload, deliveryDetails);

      var order = formatOrder(payload);

      $http.post('/orders', order)
        .then(function success () {
          ngCart.empty(true);
          // sendReceipt($scope.user, order);
          $state.go('listOrders');

          $timeout(function() {
            $window.location.reload();
          }, 1000);
        }, function error (res) {
          $scope.errors = res.data.message;
          ngCart.empty(true);
      });
    }

    function formatOrder(payload) {
      var order = {
        shippingType: payload.shippingType,
        shippingAddress: payload.shippingAddress,
		    shippingPhone: payload.shippingPhone,
        shipping: payload.shipping,
        subTotal: payload.subTotal,
        tax: payload.tax,
        total: payload.total,
        pizzas: [],
        sides: [],
        drinks: [],
        type: payload.type,
        nonce: payload.nonce
      }

      // Get pizzas
      var pizzas = payload.items.filter(function(item) {
		  console.log(pizzas);
        return item.data.orderType === 'PIZZA';
      });
      // Get drinks
      var drinks = payload.items.filter(function(item) {
        return item.data.orderType === 'DRINK';
      });

      // Get sides
      var sides = payload.items.filter(function(item) {
        return item.data.orderType === 'SIDE';
      });

      order.pizzas = pizzas;
      order.drinks = drinks;
      order.sides = sides;
      return order;
    }

    // function sendReceipt(user, order) {
    //   // Send receipt to the client
    //   jQuery.ajax({
    //     type: "POST",
    //     url: "https://mandrillapp.com/api/1.0/messages/send.json",
    //     data: {
    //       'key': 'ZQMHXDU5NA37EMKwbVplGQ',
    //       'message': {
    //         'from_email': 'kubusdrex@gmail.com',
    //         'to': [
    //           {
    //             'email': user.email,
    //             'name': user.displayName,
    //             'type': 'to'
    //           }
    //         ],
    //         'subject': 'Order Confirmation',
    //         'html': '<p>Tutaj musisz dac swoj HTML template z orderem</p>'
    //       }
    //     }
    //   });
    // }
  }
]);
