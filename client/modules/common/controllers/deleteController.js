'use strict';
atomTestApp.controller('deleteItemController', ['$scope', '$uibModalInstance', '$timeout',
    function ($scope, $uibModalInstance, $timeout) {

        var vm = this;

        $scope.currentItemTitle = ''; //Удалить клиента
        $scope.currentItemTitleGenitive = ''; //удаления клиента
        $scope.deleteButtonTitle = 'Удалить';
        $scope.cancelButtonTitle = 'Отмена';

        $scope.__deleteItemQuery = function (item) {
            return null;//userService.delete(item);
        };

        $scope.getCurrentItemName = function () {
            return ''; // $scope.currentItem.userName;
        };

        $scope.deleteItem = function () {
            $scope.showSpinner = true;

            $timeout(function () {
                var result = $scope.__deleteItemQuery($scope.currentItem);

                if (result) {
                    $scope.showSpinner = false;
                    $scope.setTitleErrorMessage = false;
                    $uibModalInstance.close($scope.currentItem);
                    return;
                }

                $scope.showSpinner = false;
                $scope.setTitleErrorMessage = true;
            }, 1000);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init = function (item) {
            $scope.currentItem = item;
        };
    }]);