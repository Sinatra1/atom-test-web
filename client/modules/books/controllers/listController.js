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
    '$scope', '$controller', '$location', '$timeout', 'bookService', 'myBookService', 'imageService',
    function ($scope, $controller, $location, $timeout, bookService, myBookService, imageService) {

        angular.extend(this, $controller('listItemsController', {$scope: $scope}));
        
        if (!$scope.authService.isAuth()) {
            $location.path('/');
            return;
        }

        $scope.bookService = bookService;
        $scope.imageService = imageService;
        
        $scope.__getTitleList = function () {
            return bookService.titleList;
        };

        $scope.__getItemsQuery = function (params) {
            return bookService.getList(angular.copy(params));
        };
        
        $scope.addToMyBooks = function (book) {
            if (!book || !book.id) {
                return;
            }
            
            $scope.successMessage = null;
            $scope.errorMessage = null;
            
            myBookService.add(book.id).then(
                    function (response) {
                        book.is_my_book = true;
                        $scope.successMessage = "Book " + book.name + " added to your books successfully";
                        
                        $scope.hideMessageWithDalay('successMessage');
                    },
                    function (response) {
                        $scope.errorMessage = "Error of adding book " + book.name + " to your books";
                        
                        $scope.hideMessageWithDalay('errorMessage');
                    }
            );
        };
        
        $scope.init();
    }]);