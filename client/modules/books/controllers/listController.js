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
    '$scope', '$controller', 'bookService',
    function ($scope, $controller, bookService) {

        angular.extend(this, $controller('listItemsController', {$scope: $scope}));

        $scope.bookService = bookService;

        $scope.__getItemsQuery = function (params) {
            return bookService.getList(angular.copy(params));
        };
        
        $scope.init();
    }]);