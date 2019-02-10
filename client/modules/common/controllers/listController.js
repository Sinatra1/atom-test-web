'use strict';
atomTestApp.controller('listItemsController', [
    '$scope', 'authService',
    function ($scope, authService) {

        $scope.currentItem = {id: ""};
        $scope.defaultLimit = 20;
        $scope.defaultOffset = 0;
        $scope.searchForm = {
            offset: $scope.defaultOffset, 
            limit: $scope.defaultLimit, 
            order_by: 'created', 
            order_mode: 'desc'
        };
        $scope.countItemsTotal = 0;
        $scope.items = [];
        $scope.authService = authService;

        $scope.__getItemsQuery = function (params) {
            return null; //userService.getList(params);
        };

        $scope.__prepareItems = function (items) {
            return items;
        };

        $scope.__beforeInit = function () {

        };

        $scope.init = function () {
            $scope.__beforeInit();

            $scope.searchItems();
        };

        $scope.searchItems = function () {
            $scope.searchForm.offset = $scope.defaultOffset;
            $scope.searchForm.limit = $scope.defaultLimit;

            $scope.getItems($scope.searchForm);

            $scope.getCountItemsTotal($scope.searchForm);
        };

        $scope.getItemsMore = function () {
            $scope.searchForm.offset += $scope.defaultLimit;

            $scope.__getItemsQuery(angular.copy($scope.searchForm)).then(
                    function (response) {
                        $scope.items = $scope.items.concat($scope.__prepareItems(response.data));

                    }, function (response) {
                $scope.searchForm.offset -= $scope.defaultOffset;
            });
            
            $scope.getCountItemsTotal($scope.searchForm);
        };

        $scope.getItems = function (params) {
            $scope.__getItemsQuery(params).then(
                    function (response) {
                        $scope.items = $scope.__prepareItems(response.data);

                    }, function (response) {
            });
        };

        $scope.getCountItemsTotal = function (params) {
            var countParams = angular.copy(params);
            countParams.count = true;

            $scope.__getItemsQuery(countParams).then(
                    function (response) {
                        $scope.countItemsTotal = parseInt(response.data);
                    }, function (response) {
            });
        };
    }]);