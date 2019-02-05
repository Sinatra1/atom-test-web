'use strict';
atomTestApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: 'modules/auths/views/login.html',
                    controller: 'userNameAuthController'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('userNameAuthController', ['$scope', 'loginService', '$location', 'authService', 'bookService',
    function ($scope, loginService, $location, authService, bookService) {

        if (authService.isAuth()) {
            $location.path('/' + bookService.urlHash);
        }

        $scope.loginUser = function (user) {
            $scope.userNameErrorMessage = false;

            loginService.loginUser(user).then(
                    function (response) {
                        $scope.userNameErrorMessage = false;
                        $location.path('/' + bookService.urlHash);
                    },
                    function (response) {
                        $scope.userNameErrorMessage = true;
                    }
            );
        }
    }]);


