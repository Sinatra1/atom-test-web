'use strict';
atomTestApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/reg', {
                    templateUrl: 'modules/reg/views/reg.html',
                    controller: 'regController'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('regController', ['$scope', 'regService', '$location', 'authService', 'loginService', 'userService', 'bookService',
    function ($scope, regService, $location, authService, loginService, userService, bookService) {

        if (authService.isAuth()) {
            $location.path('/' + bookService.urlHash);
        }

        $scope.regService = regService;
        $scope.loginService = loginService;
        $scope.userService = userService;
        $scope.isInProccess = false;

        $scope.regUser = function (user) {
            $scope.isInProccess = true;
            $scope.regErrorMessage = false;
            
            var request = regService.regUser(user);

            if (!request) {
                $scope.isInProccess = false;
                return;
            }

            request.then(
                    function (response) {
                        $scope.regErrorMessage = false;
                        $scope.isInProccess = false;
                        $location.path('/' + bookService.urlHash);
                    },
                    function (response) {
                        $scope.regErrorMessage = true;
                        $scope.isInProccess = false;
                    }
            );
        };

        $scope.isValidForm = function () {
            return (!$scope.regForm.$invalid && !$scope.firstNameError && !$scope.lastNameError && !$scope.usernameError && !$scope.emailError && !$scope.passwordError && !$scope.passwordTwiceError);
        };
    }]);


