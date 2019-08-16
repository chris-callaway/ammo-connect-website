'use strict';

/**
 * @ngdoc overview
 * @name doctorsChoicePharmacyApp
 * @description
 * # doctorsChoicePharmacyApp
 *
 * Main module of the application.
 */
angular
    .module('doctorsChoicePharmacyApp', [
        'ngAnimate',
        //'ngCookies',
        'ngResource',
        'ngRoute',
        'angular.circular-slider',
        // 'satellizer',
        'ui.bootstrap',
        'ngSanitize',
        //'simplePagination',
        //'textAngular',
        'ngFileUpload',
        'toastr',
        'angular-simple-sidebar',
        'ngMaterial',
        'angular-intro',
        'dynamicNumber'
    ]).factory('preventTemplateCache', function ($injector) {
        return {
            'request': function (config) {
                if (config.url.indexOf('views') !== -1) {
                    config.url = config.url + '?t=' + moment().format();
                }
                return config;
            }
        }
    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'MainCtrl',
                cache: false
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'LoginCtrl',
                cache: false
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl',
                controllerAs: 'RegisterCtrl',
                cache: false
            })
            .when('/admin-dashboard', {
                templateUrl: 'views/admin/admin-dashboard.html',
                controller: 'AdminDashboardCtrl',
                controllerAs: 'AdminDashboardCtrl',
                cache: false
            })
            .when('/forgot-password', {
                templateUrl: 'views/forgot-password.html',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'ForgotPasswordCtrl',
                cache: false
            })
            .when('/user-dashboard', {
                templateUrl: 'views/user-dashboard.html',
                controller: 'UserDashboardCtrl',
                controllerAs: 'UserDashboardCtrl',
                cache: false
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});
    }).config(['$httpProvider', function ($httpProvider) {

        $httpProvider.interceptors.push('preventTemplateCache');

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //Reset headers to avoid OPTIONS request (aka preflight)
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.defaults.timeout = 5000;
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
        //$httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + 'c2F1bUBhbHR1c2pvYnMuY29tOkJpbGxpb25zNDAh';
    }]).run(['$rootScope', '$location', '$http', '$templateCache', 'toastr', '$q', '$uibModal', '$window', 'Upload',
        function ($rootScope, $location, $http, $templateCache, toastr, $q, $uibModal, $window, Upload) {

            // GLOBAL FUNCTIONS
            if (window.location.href.indexOf('ammoconnect.com') > -1) {
                $rootScope.APIEndpoint = "http://192.169.217.115:8096/";
                $rootScope.APIDownloadFolder = 'http://development.gazellia.com/~developer/ammoconnect/server/';
            } else {
                $rootScope.APIEndpoint = "http://localhost:8096";
                $rootScope.APIDownloadFolder = 'http://localhost:8096/';
            }

            $rootScope.headers = {
                headers: {
                    // 'X-ApiKey': 'vfLmn+2nvr7V@ELPZh!',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'
                }
            };

            $rootScope.API = function (url, type, data) {
                var deferred = $q.defer();
                $.ajax({
                    url: url,
                    type: type,
                    data: data,
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    success: function (response) {
                        deferred.resolve(response);
                    },
                    error: function (xhr, status, error) {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            };
            $rootScope.closeLoader = function () {
                $rootScope.isLoading = false;
                $rootScope.loadingText = false;
            };

            $rootScope.changePage = function (url) {
                $location.path(url);
            };

            $rootScope.saveFile = function (file, paths) {
                var deferred = $q.defer();
                if (file.type == "application/pdf") {
                    file.upload = Upload.upload({
                        url: $rootScope.APIEndpoint,
                        data: {file: file}
                        //file: file
                    });

                    file.upload.then(function (response) {
                        var uploadPath = response.data;
                        $rootScope.paths.push(uploadPath);
                        deferred.resolve(uploadPath);
                    }, function (err) {
                        deferred.reject(err);
                    });
                } else {
                    deferred.reject('Upload failed');
                }
                return deferred.promise;
            };

            $rootScope.uploadFiles = function (files, errFiles) {
                var deferred = $q.defer();
                if (!files) {
                    deferred.resolve();
                } else {
                    $rootScope.errFile = errFiles && errFiles[0];
                    $rootScope.paths = [];
                    var prom = [];
                    angular.forEach(files, function (value, key) {
                        prom.push($rootScope.saveFile(value));
                    });

                    $q.all(prom).then(function () {
                        console.log('All uploaded');
                        deferred.resolve($rootScope.paths);
                    }, function (err) {
                        deferred.reject(err);
                    });

                }
                return deferred.promise;
            };

            $rootScope.startLoading = function (text) {
                $rootScope.loadingText = text;
                $rootScope.isLoading = true;
            };

            $rootScope.stopLoading = function () {
                $rootScope.loadingText = null;
                $rootScope.isLoading = false;
            };

            $rootScope.sendEmail = function (to, subject, html) {
                var deferred = $q.defer();
                var email = {
                    to: to,
                    body: '',
                    subject: subject,
                    html: html
                };
                var url = $rootScope.APIEndpoint + '/account/sendemail';
                $rootScope.API(url, 'POST', email).then(function (resp) {
                    deferred.resolve();
                });
                return deferred.promise;
            };

            $rootScope.logOut = function () {
                $rootScope.loggedIn = false;
                localStorage.removeItem('user');
                $rootScope.changePage('/login');
            };

            $rootScope.toast = function (type, text) {
                switch (type) {
                    case 'Success':
                        toastr.success(type, text);
                        break;
                    case 'Info':
                        toastr.info(type, text);
                        break;
                    case 'Error':
                        toastr.error(type, text);
                        break;
                    case 'Warning':
                        toastr.warning(type, text);
                        break;
                }
            };

            $rootScope.isMobile = function () {
                if (( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
                    $rootScope.mobileActive = true;
                } else if ($window.innerWidth <= 1000) {
                    $rootScope.mobileActive = true;
                    return true;
                } else {
                    $rootScope.mobileActive = false;
                }
            };

            angular.element($window).bind('resize', function () {
                $rootScope.isMobile();
            });

            $rootScope.formatDate = function (date, type) {
                if (!type) {
                    var resp = moment.tz(moment(date).utc(), 'America/New_York').format('MM/DD/YY hh:mm a');
                    if (moment(new Date(resp)).isValid()) {
                        return resp;
                    } else {
                        return '';
                    }
                } else {
                    switch (type) {
                        case 'short':
                            var resp = moment.tz(moment(date).utc(), 'America/New_York').format('MM/DD/YY');
                            if (moment(new Date(resp)).isValid()) {
                                return resp;
                            } else {
                                return '';
                            }
                            break;
                    }
                }
            };

            $rootScope.formatNumber = function (number) {
                number = parseFloat(number);
                if (!isNaN(number)) {
                    return number.toFixed(2);
                } else {
                    return '';
                }
            };

            $rootScope.formatTime = function (time, formatted) {
                if (time) {
                    var duration = moment.duration(parseInt(time), 'seconds');
                    var formattedFinal = duration.format(formatted);
                    return formattedFinal;
                } else {
                    return '';
                }
            };

            $rootScope.showModal = function (modal, scope, callback) {
                var deferred = $q.defer();
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modals/' + modal.template,
                    controller: modal.controller,
                    size: 'md',
                    scope: scope,
                    resolve: {}
                });

                modalInstance.result.then(function (controller) {
                    deferred.resolve({controller: controller, scope: scope});
                }, function () {
                    if (callback) callback();
                    deferred.resolve();
                });
                return deferred.promise;
            };

            $rootScope.reloadRoute = function () {
                $window.location.reload();
            };

            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            // refresh local storage data on load is user is already logged in

            if (localStorage.getItem('user')) {
                $rootScope.loggedIn = true;
                $rootScope.user = JSON.parse(localStorage.getItem('user'));
                $rootScope.isMobile();
            } else {
                // check for mobile
                $rootScope.isMobile();
            }

            // URL routing and handling

            $rootScope.$watch(function () {
                    return $location.path();
                },
                function (url) {

                    // restore scope boolean if user is logged in while changing pages

                    if (localStorage.getItem('user')) {
                        $rootScope.loggedIn = true;
                    }

                    // un-used page handling

                    switch (url) {
                        case '/':
                            break;
                    }

                    // re-route user to root if not logged in

                    if (url != '' && url != '/' && url != '/#' && url != '/register' && url != '/login' && url != '/forgot-password' && url != '/search' && !localStorage.getItem('user')) {
                        alert('Log in to visit this page ' + url);
                        $location.path('/login');
                    }
                });

        }]).
    directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }).directive('fileReader', ['$rootScope', function ($rootScope) {
        return {
            scope: {
                fileReader: "="
            },
            link: function (scope, element) {
                $(element).on('change', function (changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function (e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileReader = contents;
                                if (files[0]) {
                                    scope.fileType = files[0].type;
                                }
                            });
                            $rootScope.$apply(function () {
                                if (files[0]) {
                                    $rootScope.currentFile = files;
                                    $rootScope.fileType = files[0].type;
                                    $rootScope.uploadedFile = contents;
                                }
                            });
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    }]).filter('startFrom', function () {
        return function (input, start) {
            if (!input || !input.length) {
                return;
            }
            start = +start; //parse to int
            return input.slice(start);
        }
    }).filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    }).config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 3,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: true,
            target: 'body'
        });
    }).directive('myTouchstart', [function () {
        return function (scope, element, attr) {

            element.on('touchstart', function (event) {
                scope.$apply(function () {
                    scope.$eval(attr.myTouchstart);
                });
            });
        };
    }]).directive('myTouchend', [function () {
        return function (scope, element, attr) {

            element.on('touchend', function (event) {
                scope.$apply(function () {
                    scope.$eval(attr.myTouchend);
                });
            });
        };
    }]).directive('phoneInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/[^0-9]/g, '');
                    $element.val($filter('tel')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                        return;
                    }
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            }

        };
    }).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]).filter('tel', function () {
        return function (tel) {
            if (!tel) {
                return '';
            }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;

                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if (number) {
                if (number.length > 3) {
                    number = number.slice(0, 3) + '-' + number.slice(3, 7);
                }
                else {
                    number = number;
                }

                return ("(" + city + ") " + number).trim();
            }
            else {
                return "(" + city;
            }

        };
    }).directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]).directive("selectNgFiles", function () {
        return {
            require: "ngModel",
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on("change", function (e) {
                    var files = elem[0].files;
                    ngModel.$setViewValue(files);
                })
            }
        }
    });
