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
        $scope.isMyBooksMode = true;
        
        $scope.__getTitleList = function () {
            return myBookService.titleList;
        };

        $scope.__getItemsQuery = function (params) {
            return myBookService.getList(angular.copy(params));
        };
        
        $scope.removeFromMyBooks = function (book, index) {
            if (!book || !book.id) {
                return;
            }
            
            $scope.successMessage = null;
            $scope.errorMessage = null;
            
            myBookService.remove(book.id).then(
                    function (response) {
                        $scope.items.splice(index, 1);
                        $scope.countItemsTotal--;
                        $scope.successMessage = "Book " + book.name + " removed from your books successfully";
                        
                        $scope.hideMessageWithDalay('successMessage');
                    },
                    function (response) {
                        $scope.errorMessage = "Error of removing book " + book.name + " from your books";
                        
                        $scope.hideMessageWithDalay('errorMessage');
                    }
            );
        };
        
        $scope.init();
    }]);