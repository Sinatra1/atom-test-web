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
    }]).controller('loginController', ['$scope', 'loginService', '$location', 'authService', 'regService',
    function ($scope, loginService, $location, authService, regService) {

        if (authService.isAuth()) {
            $location.path('/' + bookService.urlHash);
        }
        
        $scope.loginService = loginService;
        $scope.regService = regService;
        
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


