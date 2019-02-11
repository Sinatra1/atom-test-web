'use strict';
atomTestApp.controller('deleteUserController', [
    '$scope', '$controller', '$uibModalInstance', 'userService', 'currentUser',
    function ($scope, $controller, $uibModalInstance, userService, currentUser) {

        angular.extend(this, $controller('deleteItemController', {$scope: $scope, $uibModalInstance: $uibModalInstance}));

        $scope.currentItemTitle = 'Delete profile';

        $scope.__deleteItemQuery = function (item) {
            return userService.delete();
        };

        $scope.getCurrentItemName = function () {
            return userService.formatName($scope.currentItem);
        };

        $scope.init(currentUser);
    }]);