'use strict';

/**
 * @ngdoc function
 * @name doctorsChoicePharmacyApp.controller:DrugSearchCtrl
 * @description
 * # DrugSearchCtrl
 * Controller of the doctorsChoicePharmacyApp
 */
angular.module('doctorsChoicePharmacyApp')
  .controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$q', '$location', function ($scope, $rootScope, $http, $q, $location) {


    //Contact
    $('form.contactForm').submit(function () {

      var f = $(this).find('.form-group'),
        ferror = false,
        emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

      f.children('input').each(function () { // run all inputs

        var i = $(this); // current input
        var rule = i.attr('data-rule');

        if (rule !== undefined) {
          var ierror = false; // error flag for current input
          var pos = rule.indexOf(':', 0);
          if (pos >= 0) {
            var exp = rule.substr(pos + 1, rule.length);
            rule = rule.substr(0, pos);
          } else {
            rule = rule.substr(pos + 1, rule.length);
          }

          switch (rule) {
            case 'required':
              if (i.val() === '') {
                ferror = ierror = true;
              }
              break;

            case 'minlen':
              if (i.val().length < parseInt(exp)) {
                ferror = ierror = true;
              }
              break;

            case 'email':
              if (!emailExp.test(i.val())) {
                ferror = ierror = true;
              }
              break;

            case 'checked':
              if (!i.attr('checked')) {
                ferror = ierror = true;
              }
              break;

            case 'regexp':
              exp = new RegExp(exp);
              if (!exp.test(i.val())) {
                ferror = ierror = true;
              }
              break;
          }
          i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
        }
      });
      f.children('textarea').each(function () { // run all inputs

        var i = $(this); // current input
        var rule = i.attr('data-rule');

        if (rule !== undefined) {
          var ierror = false; // error flag for current input
          var pos = rule.indexOf(':', 0);
          if (pos >= 0) {
            var exp = rule.substr(pos + 1, rule.length);
            rule = rule.substr(0, pos);
          } else {
            rule = rule.substr(pos + 1, rule.length);
          }

          switch (rule) {
            case 'required':
              if (i.val() === '') {
                ferror = ierror = true;
              }
              break;

            case 'minlen':
              if (i.val().length < parseInt(exp)) {
                ferror = ierror = true;
              }
              break;
          }
          i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
        }
      });
      if (ferror) return false;
      else var str = $(this).serialize();
      $.ajax({
        type: "POST",
        url: "bat/rd-mailform.php",
        data: str,
        success: function (msg) {
          alert('Thank you for submitting!');
        }
      });
      return false;
    });

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
      $("html, body").animate({
        scrollTop: 0
      }, "slow");
      $scope.getEntries();
    };

    $scope.init();

  }]);
