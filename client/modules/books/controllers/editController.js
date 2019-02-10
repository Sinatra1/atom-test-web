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
        
        if (!$scope.authService.isAuth()) {
            $location.path('/');
            return;
        }
        
        var vm = this;

        $scope.bookService = bookService;
        
        $scope.__deleteTemplateUrl = 'modules/common/views/deleteModal.html';
        $scope.__deleteControllerName = 'deleteBookController';

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
            var data = vm.prepareBookForRequest();

            if ($scope.currentItem.id) {
                return bookService.update(data, $scope.currentItem.id);
            }

            return bookService.create(data);
        };

        $scope.__transmitDataToDeleteController = function () {
            return {
                currentBook: function () {
                    return angular.copy($scope.currentItem);
                }
            };
        };

        $scope.__afterDelete = function (currentItem) {
            $location.path('/' + bookService.urlHash);
        };

        vm.prepareBookForRequest = function () {
            var notAllowedFields = ['newImages', 'newImagesFiles', 'deleteImagesIds', 'imagesId'];

            var data = {};
            data.files = new FormData();

            var keys = Object.keys($scope.currentItem);

            if ($scope.currentItem.deleteImagesIds != null && $scope.currentItem.deleteImagesIds[0] != null) {
                $scope.currentItem.cover_image = '';
            }

            for (var i = 0; i < keys.length; i++) {
                if (notAllowedFields.indexOf(keys[i]) !== -1 || $scope.currentItem[keys[i]] === null || $scope.currentItem[keys[i]] === undefined) {
                    continue;
                }

                data.files.append(keys[i], $scope.currentItem[keys[i]]);
            }

            if ($scope.currentItem.newImagesFiles && $scope.currentItem.newImagesFiles[0]) {
                data.files.append('cover_image_file', $scope.currentItem.newImagesFiles[0]);
            }

            return data;
        };

        $scope.__close = function (id) {
            if (!id) {
                return;
            }

            $location.path('/' + bookService.urlHash + '/detail/' + id);
        };

        $scope.__afterInit = function () {
            if ($routeParams.id != null && $scope.authService.currentUser.id != $scope.currentItem.created_user_id) {
                $location.path('/' + bookService.urlHash);
                return;
            }
            
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