'use strict';
atomTestApp.controller('listItemsController', [
    '$scope', 'authService', '$timeout',
    function ($scope, authService, $timeout) {

        $scope.currentItem = {id: ""};
        $scope.defaultLimit = 10;
        $scope.defaultOffset = 0;
        $scope.searchForm = {
            offset: $scope.defaultOffset,
            limit: $scope.defaultLimit,
            order_by: 'created',
            order_mode: 'asc'
        };
        $scope.countItemsTotal = 0;
        $scope.items = [];
        $scope.authService = authService;
        $scope.titleList = null;

        $scope.__getItemsQuery = function (params) {
            return null; //userService.getList(params);
        };

        $scope.__prepareItems = function (items) {
            return items;
        };

        $scope.__getTitleList = function () {

        };

        $scope.init = function () {
            $scope.titleList = $scope.__getTitleList();

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
            var request = $scope.__getItemsQuery(params);

            if (!request) {
                return;
            }

            request.then(
                    function (response) {
                        $scope.items = $scope.__prepareItems(response.data);

                    }, function (response) {
            });
        };

        $scope.getCountItemsTotal = function (params) {
            var countParams = angular.copy(params);
            countParams.count = true;

            var request = $scope.__getItemsQuery(countParams);

            if (!request) {
                return;
            }

            request.then(
                    function (response) {
                        $scope.countItemsTotal = parseInt(response.data);
                    }, function (response) {
            });
        };
        
        $scope.hideMessageWithDalay = function (key, delay) {
            if (!delay) {
                delay = 5000;
            }
            
            $timeout(function () {
                delete $scope[key];
            }, delay);
        };
    }]);