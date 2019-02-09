'use strict';
atomTestApp.controller('deleteItemController', ['$scope', '$uibModalInstance', '$timeout',
    function ($scope, $uibModalInstance, $timeout) {

        var vm = this;

        $scope.currentItemTitle = ''; //Удалить клиента
        $scope.currentItemTitleGenitive = ''; //удаления клиента
        $scope.deleteButtonTitle = 'Delete';
        $scope.cancelButtonTitle = 'Cancel';

        $scope.__deleteItemQuery = function (item) {
            return null;//userService.delete(item);
        };

        $scope.getCurrentItemName = function () {
            return ''; // $scope.currentItem.userName;
        };

        $scope.deleteItem = function () {
            $scope.showSpinner = true;
            $scope.setTitleErrorMessage = false;

            $timeout(function () {
                var request = $scope.__deleteItemQuery($scope.currentItem);

                if (!request) {
                    $scope.deleteItemError();
                    return;
                }

                request.then(function (response) {
                    $scope.showSpinner = false;
                    $scope.setTitleErrorMessage = false;
                    $uibModalInstance.close($scope.currentItem);
                }, function (response) {
                    $scope.deleteItemError(response);
                });
            }, 1000);
        };

        $scope.deleteItemError = function () {
            $scope.showSpinner = false;
            $scope.setTitleErrorMessage = true;
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init = function (item) {
            $scope.currentItem = item;
        };
    }]);