'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {
    $scope.register = function () {
      // check email prior to prompt
      $scope.verifyEmail().then(function () {
        if (confirm("Are you sure this information is correct?")) {
          if ($scope.registerForm.$valid) {

            $rootScope.isLoading = true;
            var url = $rootScope.APIEndpoint + '/loan/apply';
            $rootScope.API(url, 'POST', $scope.Registration).then(function (resp) {

              $rootScope.isLoading = false;
              var loanId = parseInt(resp) + 10000;
              localStorage.setItem('loanRefNumber', loanId);

              // send application submission email
              var emailBody = createEmailBody();

              var prom = [];
              prom.push($rootScope.sendEmail($scope.Registration.Email, 'JSSA Application Submitted', emailBody));
              prom.push($rootScope.sendEmail('info@jssamoneyadvancesearch.com', 'JSSA Application Submitted', emailBody));

              $q.all(prom).then(function () {
                $rootScope.toast('Success', 'Sent email successfully.');
              });

              // factor pre-approved information
              $scope.preApprovedAmount = getPreApprovedAmount();
              $rootScope.toast('Success', 'Application is pre-approved!');
              localStorage.setItem('preapproved_amt', $scope.preApprovedAmount);

              // save form data
              localStorage.setItem('registerForm', JSON.stringify($scope.Registration));
              $location.path('/pre-approved');
            }, function (err) {
              if (err.status == 200) {
                $rootScope.toast('Success', 'Sent email successfully.');
              } else {
                $rootScope.isLoading = false;
                $rootScope.toast('Error', 'Server error or email already in use.');
              }
            });
          } else {
            $rootScope.toast('Error', 'Please fill out the entire form');
          }
        }
      });
    };

    function ValidateEmail(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
      }
    }

    $scope.verifyEmail = function () {
      var deferred = $q.defer();
      var email = $scope.Registration.Email;
      if (ValidateEmail(email)) {
        var url = $rootScope.APIEndpoint + '/loan/emailisregistered';
        $rootScope.API(url, 'POST', $scope.Registration).then(function (resp) {
          if (resp) {
            $rootScope.toast('Error', 'Application has already been submitted with this email address');
          } else {
            deferred.resolve();
            $rootScope.toast('Success', 'Email is available');
          }
        }, function (err) {
          deferred.reject(err);
          $rootScope.toast('Error', 'Application has already been submitted with this email address');
        });
      }
      return deferred.promise;
    };

    function getPreApprovedAmount() {
      var monthOne = parseFloat($scope.Registration.SalesMonthOne ? $scope.Registration.SalesMonthOne : 0);
      var monthTwo = parseFloat($scope.Registration.SalesMonthTwo ? $scope.Registration.SalesMonthTwo : 0);
      var monthThree = parseFloat($scope.Registration.SalesMonthThree ? $scope.Registration.SalesMonthThree : 0);
      var totalMonths = 3;

      // get average of last three months revenue
      var averageOfThreeMonthsRevenue = (monthOne + monthTwo + monthThree) / 3;

      // get seven percent
      var tenPercent = averageOfThreeMonthsRevenue * 0.07;

      // multiply by twelve months
      var result = tenPercent * 12;

      // determine if amount exceeds amount requested
      var maxAmount = parseInt($scope.Registration.DesiredLoanAmount.replace(/\$/g, '').replace(/,/g, '').split('-')[1].trim());
      if (result > maxAmount) {
        result = maxAmount;
      }

      return result.toFixed(2);
    }

    function createEmailBody() {
      var emailBody = 'JSSA Admin, <br /><br /><b>The following user has submitted an application:</b><br /><br />';

      emailBody += '<table><tbody>';
      for (var property in $scope.Registration) {
        if ($scope.Registration.hasOwnProperty(property)) {
          if (property != 'Password') {
            emailBody += '<tr><td><b>' + property + '</b>: ' + '</td><td>' + $scope.Registration[property] + '</td></tr>';
          }
        }
      }

      emailBody += '</tbody></table>';
      return emailBody;
    }

    $scope.goBack = function () {
      $location.path('/login');
    };

    $scope.reviewInfo = function () {
      $("html, body").animate({scrollTop: 0}, "slow");
    };

    $scope.upload = function (element) {
      if (element.files[0].size > 3000000) {
        $rootScope.toast('Error', 'File size must be 3mb or smaller');
        element.value = "";
      } else {
        $rootScope.isLoading = true;
        var file = element.files[0];
        getBase64(file, function (base64) {
          $scope.Registration.VoidedCheck = base64;
          $rootScope.isLoading = false;
        });
      }
    };

    $scope.init = function () {
      $("html, body").animate({scrollTop: 0}, "slow");
      $scope.states = states;
      $scope.ready = true;
      $scope.Registration = {};
      //if (localStorage.getItem('registerForm')) {
      //  // has a draft
      //  $rootScope.showModal({
      //    template: 'form-draft.html',
      //    controller: 'FormDraftCtrl'
      //  }, $scope).then(function (resp) {
      //    if (resp.controller.continueForm) {
      //      $scope.Registration = JSON.parse(localStorage.getItem('registerForm'));
      //      $scope.verifyEmail();
      //    }
      //  });
      //} else {
      //  $scope.Registration = {};
      //}
    };

    $scope.init();

  }]);
