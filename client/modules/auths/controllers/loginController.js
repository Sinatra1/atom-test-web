'use strict';
atomTestApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'modules/auths/views/login.html',
                    controller: 'loginController'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('loginController', ['$scope', 'loginService', '$location', 'authService', 'userService', 'bookService',
    function ($scope, loginService, $location, authService, userService, bookService) {

        if (authService.isAuth()) {
            $location.path('/' + bookService.urlHash);
        }

        $scope.loginService = loginService;
        $scope.userService = userService;
        $scope.isInProccess = false;

        $scope.loginUser = function (user) {
            $scope.loginErrorMessage = false;
            $scope.isInProccess = true;

            var request = loginService.loginUser(user);

            if (!request) {
                $scope.isInProccess = false;
            }

            request.then(
                    function (response) {
                        $scope.loginErrorMessage = false;
                        $scope.isInProccess = false;
                        $location.path('/' + bookService.urlHash);
                    },
                    function (response) {
                        $scope.loginErrorMessage = true;
                        $scope.isInProccess = false;
                    }
            );
        };
        
        $scope.isValidForm = function () {
            return (!$scope.authForm.$invalid && !$scope.usernameError && !$scope.passwordError);
        };
    }]);


