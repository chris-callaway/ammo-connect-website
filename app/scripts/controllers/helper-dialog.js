'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:HelperDialogCtrl
 * @description
 * # HelperDialogCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('HelperDialogCtrl', function ($scope, $uibModalInstance) {
        $scope.ok = function () {
            $uibModalInstance.close($scope); // pass in item to catch in resolve
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
