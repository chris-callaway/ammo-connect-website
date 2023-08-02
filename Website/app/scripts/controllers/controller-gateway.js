'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:ControllerGatewayCtrl
 * @description
 * # ControllerGatewayCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
  .controller('ControllerGatewayCtrl', function ($scope, $rootScope) {

    $scope.controllerGateway = function (method, params, scope) {
      setTimeout(function () {
        $rootScope.$broadcast('controllerGateway', {
          method: method,
          params: params,
          scope: scope
        });
      }, 500);
    };

  });
