'use strict';
atomTestApp.controller('deleteBookController', [
    '$scope', '$controller', '$uibModalInstance', 'bookService', 'currentBook',
    function ($scope, $controller, $uibModalInstance, bookService, currentBook) {

        angular.extend(this, $controller('deleteItemController', {$scope: $scope, $uibModalInstance: $uibModalInstance}));

        $scope.currentItemTitle = 'Delete book';

        $scope.__deleteItemQuery = function (item) {
            return bookService.delete(item.id);
        };

        $scope.getCurrentItemName = function () {
            return $scope.currentItem.name;
        };

        $scope.init(currentBook);
    }]);