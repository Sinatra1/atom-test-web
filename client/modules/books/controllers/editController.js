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
    '$scope', '$controller', '$routeParams', '$location', 'bookService',
    function ($scope, $controller, $routeParams, $location, bookService) {

        angular.extend(this, $controller('editItemController', {$scope: $scope}));

        $scope.bookService = bookService;

        $scope.currentItem = {id: ""};

        $scope.__getCreateCurrentItemTitle = function () {
            return "Create book";
        };

        $scope.__getEditCurrentItemTitle = function () {
            return "Edit book";
        };

        $scope.__getItemByIdQuery = function (id) {
            return bookService.getById(id);
        };

        $scope.__updateItemQuery = function () {
            var data = {};
            data.files = new FormData();

            var keys = Object.keys($scope.currentItem);
            
            if ($scope.currentItem.deleteImagesIds != null && $scope.currentItem.deleteImagesIds[0] != null) {
                $scope.currentItem.cover_image = '';
            }

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == 'newImages' || keys[i] == 'newImagesFiles' || keys[i] == 'deleteImagesIds' || keys[i] == 'imagesId' || $scope.currentItem[keys[i]] === null) {
                    continue;
                }
                
                data.files.append(keys[i], $scope.currentItem[keys[i]]);
            }

            if ($scope.currentItem.newImagesFiles && $scope.currentItem.newImagesFiles[0]) {
                data.files.append('cover_image_file', $scope.currentItem.newImagesFiles[0]);
            }
            
            if ($scope.currentItem.id) {
                return bookService.update(data, $scope.currentItem.id);
            }

            return bookService.create(data);
        };
        
        $scope.__close = function (id) {
            if (!id) {
                return;
            }
            
            $location.path('/' + bookService.urlHash + '/detail/' + id);
        };
        
        $scope.__afterInit = function () {
            if (!$scope.currentItem || !$scope.currentItem.cover_image) {
                return;
            }
            
            $scope.currentItem.imagesId = [];
            $scope.currentItem.imagesId.push($scope.currentItem.cover_image);
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