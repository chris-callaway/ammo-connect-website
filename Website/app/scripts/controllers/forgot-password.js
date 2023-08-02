'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {

        var event = $location.search()['event'];
        if (event == 'signing_success') {
            $scope.signingSuccess = true;
        }
        var validateForm = function () {
            var valid = true;
            if (!$scope.user.Login || $scope.user.Login.length < 4) {
                valid = false;
            }
            return valid;
        };

        $scope.sendPassword = function () {
            $rootScope.isLoading = true;
            var valid = validateForm();
            if (valid) {
                var url = $rootScope.APIEndpoint + '/loan/forgotpassword';
                var data = {'email': $scope.user.Login};
                $rootScope.API(url, 'POST', data).then(function (resp) {
                    console.log('resp is', resp);
                    if (resp.status == 200) {
                        $rootScope.toast('Success', 'Email sent');
                        $rootScope.isLoading = false;
                        $location.path('/login');
                    }
                }, function (err) {
                    $rootScope.toast('Success', 'Email sent');
                    $rootScope.isLoading = false;
                    $location.path('/login');
                });
            } else {
                $rootScope.isLoading = false;
                $rootScope.toast('Error', 'Please fill out a valid email address ' + $scope.user.Login);
            }
        };

        $scope.goBack = function () {
            $location.path('/login');
        };

        $scope.init = function () {
            $scope.ready = true;
            $scope.user = {};
        };

        $scope.init();

    }]);
