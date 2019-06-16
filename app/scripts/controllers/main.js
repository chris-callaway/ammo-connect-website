'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:DrugSearchCtrl
 * @description
 * # DrugSearchCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
    .controller('MainCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {

        $scope.getEntries = function () {
            var deferred = $q.defer();
            $rootScope.isLoading = true;
            var url = $rootScope.APIEndpoint;

            var query = 'SELECT * FROM entries';
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
                for (var i in resp) {
                    resp[i].price = parseFloat(resp[i].price);
                }
                $scope.entries = resp;
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        $scope.init = function () {
            $("html, body").animate({scrollTop: 0}, "slow");
            $scope.getEntries();
        };

        $scope.init();

    }]);
