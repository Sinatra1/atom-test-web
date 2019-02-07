'use strict';
atomTestApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/books/edit/:id', {
                    controller: 'editBookController',
                    controllerAs: 'editBookVm',
                    templateUrl: 'modules/books/views/edit.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/books/edit', {
                    controller: 'editBookController',
                    controllerAs: 'editBookVm',
                    templateUrl: 'modules/books/views/edit.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('editBookController', [
    '$scope', '$controller', '$routeParams', 'bookService',
    function ($scope, $controller, $routeParams, bookService) {

        angular.extend(this, $controller('editItemController', {$scope: $scope}));

        $scope.bookService = bookService;

        $scope.currentItem = {id: ""};

        $scope.__getCreateCurrentItemTitle = function () {
            return "Create book";
        };

        $scope.__getEditCurrentItemTitle = function () {
            return bookService.formatName($scope.currentItem.name);
        };

        $scope.__getItemByIdQuery = function (id) {
            return bookService.getById(id);
        };

        $scope.__updateItemQuery = function () {
            var data = {};
            data.files = new FormData();

            var keys = Object.keys($scope.currentItem);

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == 'newImages' || keys[i] == 'newImagesFiles') {
                    continue;
                }
                
                data.files.append(keys[i], $scope.currentItem[keys[i]]);
            }

            if ($scope.currentItem.newImagesFiles && $scope.currentItem.newImagesFiles[0]) {
                data.files.append('cover_image_file', $scope.currentItem.newImagesFiles[0]);
            }

            return bookService.update(data);
        };

        $scope.isValidForm = function () {
            return (!$scope.editForm.$invalid && !$scope.bookNameError && !$scope.editForm.bookIsbn.$invalid && !$scope.yearError);
        };

        $scope.isValidIsbn = function (event) {
            if (!event || !event.target) {
                return false;
            }

            var $element = angular.element(event.target);

            if ($element.hasClass('ng-valid-isbn13')) {
                return true;
            }

            return false;
        };

        $scope.formatIsbn = function () {
            $scope.currentItem.isbn = bookService.formatIsbn($scope.currentItem.isbn);
        };

        if ($routeParams.id) {
            $scope.getCurrentItemById($routeParams.id);
        } else {
            $scope.init();
        }
    }]);