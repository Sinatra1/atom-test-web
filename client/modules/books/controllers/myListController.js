'use strict';
atomTestApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/my-books', {
                    controller: 'listMyBooksController',
                    controllerAs: 'myBooksVm',
                    templateUrl: 'modules/books/views/list.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('listMyBooksController', [
    '$scope', '$controller', '$location', 'myBookService', 'imageService',
    function ($scope, $controller, $location, myBookService, imageService) {

        angular.extend(this, $controller('listItemsController', {$scope: $scope}));
        
        if (!$scope.authService.isAuth()) {
            $location.path('/');
            return;
        }

        $scope.myBookService = myBookService;
        $scope.imageService = imageService;
        
        $scope.__getTitleList = function () {
            return myBookService.titleList;
        };

        $scope.__getItemsQuery = function (params) {
            return myBookService.getList(angular.copy(params));
        };
        
        $scope.init();
    }]);