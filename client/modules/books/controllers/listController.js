'use strict';
atomTestApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/books', {
                    controller: 'listBooksController',
                    controllerAs: 'booksVm',
                    templateUrl: 'modules/books/views/list.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('listBooksController', [
    '$scope', '$controller', '$location', 'bookService', 'imageService',
    function ($scope, $controller, $location, bookService, imageService) {

        angular.extend(this, $controller('listItemsController', {$scope: $scope}));
        
        if (!$scope.authService.isAuth()) {
            $location.path('/');
            return;
        }

        $scope.bookService = bookService;
        $scope.imageService = imageService;

        $scope.__getItemsQuery = function (params) {
            return bookService.getList(angular.copy(params));
        };
        
        $scope.init();
    }]);