'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:DrugSearchCtrl
 * @description
 * # DrugSearchCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('AdminDashboardCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {

        $scope.getAccountList = function () {
            var deferred = $q.defer();
            var url = $rootScope.APIEndpoint + '/account/getaccountlist';
            $rootScope.API(url, 'GET').then(function (resp) {
                deferred.resolve(resp);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        $scope.init = function () {
            $("html, body").animate({scrollTop: 0}, "slow");
            $scope.getAccountList();
            $scope.user = JSON.parse(localStorage.getItem('user'));
            // kick out unauthorized users
            if (!$scope.user) {
                $location.path('/login');
            }
        };

        $scope.init();

    }]);
