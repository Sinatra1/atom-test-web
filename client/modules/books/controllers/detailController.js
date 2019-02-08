'use strict';
atomTestApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/books/detail/:id', {
                    controller: 'detailBookController',
                    controllerAs: 'detailBookVm',
                    templateUrl: 'modules/books/views/detail.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('detailBookController', [
    '$scope', '$controller', '$routeParams', 'bookService',
    function ($scope, $controller, $routeParams, bookService) {

        angular.extend(this, $controller('editItemController', {$scope: $scope}));

        $scope.bookService = bookService;

        $scope.__getEditCurrentItemTitle = function () {
            return bookService.formatName($scope.currentItem);
        };

        $scope.__getItemByIdQuery = function (id) {
            return bookService.getById(id);
        };
        
        $scope.__afterInit = function () {
            if (!$scope.currentItem || !$scope.currentItem.cover_image) {
                return;
            }
            
            $scope.currentItem.imagesId = [];
            $scope.currentItem.imagesId.push($scope.currentItem.cover_image);
        };

        if ($routeParams.id) {
            $scope.getCurrentItemById($routeParams.id);
        }
    }]);