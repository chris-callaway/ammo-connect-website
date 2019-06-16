'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {

        var event = $location.search()['event'];
        if (event == 'signing_success') {
            $scope.signingSuccess = true;
        }
        var validateForm = function () {
            var valid = true;
            if (!$scope.user.Login || $scope.user.Login.length < 4) {
                valid = false;
            }
            if (!$scope.user.Password) {
                valid = false;
            }
            return valid;
        };

        $scope.login = function () {
            $rootScope.isLoading = true;
            var valid = validateForm();
            if (valid) {
                var url = $rootScope.APIEndpoint;
                var obj = {
                    Method: 'login',
                    Module: 'Auth',
                    params: {
                        username: $scope.user.Login,
                        password: $scope.user.Password
                    }
                };
                $rootScope.API(url, 'POST', obj).then(function (resp) {
                    //$rootScope.toast('Success', 'Login success');
                    $rootScope.isLoading = false;
                    // save local storage
                    localStorage.setItem('user', JSON.stringify(resp.user));
                    $location.path('/user-dashboard');
                }, function (err) {
                    $rootScope.isLoading = false;
                    $rootScope.toast('Error', 'Please fill out a valid user name and password');
                });
            } else {
                $rootScope.isLoading = false;
                $rootScope.toast('Error', 'Please fill out a valid user name and password');
            }
        };

        $scope.init = function () {
            // destroy session
            localStorage.removeItem('user');

            $scope.ready = true;
            $scope.user = {};
        };

        $scope.init();

    }]);
