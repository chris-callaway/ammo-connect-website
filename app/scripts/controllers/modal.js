'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
  .controller('ModalCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
      $uibModalInstance.close($scope); // pass in item to catch in resolve
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
