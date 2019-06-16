'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:DrugSearchCtrl
 * @description
 * # DrugSearchCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('UserDashboardCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {

        $scope.getModules = function () {
            var deferred = $q.defer();
            $rootScope.isLoading = true;
            var url = $rootScope.APIEndpoint;

            var query = 'SELECT * FROM Modules WHERE user_id = "' + $scope.user.id + '"';
            var obj = {
                Method: 'query',
                Module: 'Database',
                params: {
                    query: query
                }
            };

            $rootScope.API(url, 'POST', obj).then(function (resp) {
                $rootScope.isLoading = false;
                $scope.ready = true;
                $scope.modules = resp;
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        $scope.init = function () {
            $("html, body").animate({scrollTop: 0}, "slow");
            $scope.user = JSON.parse(localStorage.getItem('user'));
            // kick out unauthorized users
            if (!$scope.user) {
                $location.path('/login');
            } else {
                console.log('has user', $scope.user);
                $scope.getModules();
            }
        };

        console.log('loading');
        $scope.init();

    }]);
