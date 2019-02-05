'use strict';
atomTestApp.controller('editItemController', [
    '$scope', '$timeout',
    function ($scope, $timeout) {
        var vm = this;

        $scope.currentItem = {id: ""};
        $scope.currentItemTitle = null;

        $scope.__getCreateCurrentItemTitle = function () {
            return null; //"Создание клиента";
        };

        $scope.__getEditCurrentItemTitle = function () {
            return null; //'Клиент ' + $scope.currentItem.userName;
        };

        $scope.__afterInit = function () {
            //vm.fillAvailableRatingValues();
        };

        $scope.__updateItemQuery = function () {
            return null;//userService.update($scope.currentItem);
        };

        $scope.__getItemByIdQuery = function (id) {
            return null;//userService.getById(id);
        };

        $scope.__beforeClose = function (item) {
            return item;
        };

        $scope.__close = function (item) {
            return item;
        };

        $scope.__cancel = function () {

        };

        $scope.init = function (currentItem) {
            $scope.currentItem = currentItem;

            if (!currentItem || !currentItem.id) {
                $scope.currentItemTitle = $scope.__getCreateCurrentItemTitle();
            } else {
                $scope.currentItemTitle = $scope.__getEditCurrentItemTitle();
            }

            $scope.__afterInit();
        };

        $scope.updateItem = function () {
            $scope.showSpinner = true;

            $timeout(function () {
                var item = $scope.__updateItemQuery();
                
                if (!item && !item.id) {
                    $scope.updateItemError();
                    return;
                }

                $scope.updateItemSuccess(item);
            }, 1000);
        };

        $scope.updateItemSuccess = function (item) {
            $scope.showSpinner = false;
            $scope.setUserNameErrorMessage = false;
            item = $scope.__beforeClose(item);
            $scope.__close(item);
        };

        $scope.updateItemError = function () {
            $scope.showSpinner = false;
            $scope.setUserNameErrorMessage = true;
        };

        $scope.getCurrentItemById = function (id) {
            if (!id) {
                return;
            }
            
            var request = $scope.__getItemByIdQuery(id);
            
            if (!request) {
                return;
            }

            request.then(
                function (response) {
                    $scope.init(response.data);
                },
                function (response) {

                }
            );
        };

        $scope.setSelectField = function (event, fieldName) {
            if (!event || !event.target || !fieldName) {
                return;
            }

            $scope.currentItem[fieldName] = event.target.selectedOptions[0].value.trim();
        };

        $scope.cancel = function () {
            $scope.__beforeClose();
            $scope.__cancel();
        };
    }]);