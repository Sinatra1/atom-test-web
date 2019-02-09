'use strict';
atomTestApp.controller('listItemsController', ['$scope', '$uibModal', '$timeout', 'authService',
    function ($scope, $uibModal, $timeout, authService) {

        var vm = this;

        vm.animationsEnabled = true;
        vm.showMessageDelay = 5000;
        $scope.currentItem = {id: ""};
        $scope.defaultLimit = 20;
        $scope.defaultOffset = 0;
        $scope.searchForm = {
            offset: $scope.defaultOffset, 
            limit: $scope.defaultLimit, 
            order_by: 'created', 
            order_mode: 'desc'
        };
        $scope.sortFieldName;
        $scope.sortModeAsc = true;
        $scope.countItemsTotal = 0;
        $scope.items = [];
        $scope.authService = authService;

        $scope.__editTemplateUrl = null; //'modules/users/views/editModal.html';
        $scope.__editControllerName = null; // 'editUserController';

        $scope.__deleteTemplateUrl = null; //'modules/users/views/deleteModal.html';
        $scope.__deleteControllerName = null; // 'deleteUserController';

        $scope.__getDefaultSortFieldName = function () {
            return null; //'name';
        };

        $scope.__transmitDataToEditController = function () {
            return {};

            /*return {
             currentItem: function () {
             return angular.copy($scope.currentItem);
             }
             };*/
        };

        $scope.__transmitDataToDeleteController = function () {
            return {};

            /*return {
             currentItem: function () {
             return angular.copy($scope.currentItem);
             }
             };*/
        };

        $scope.__updateItemLocaly = function (currentItem) {
            /*$scope.currentItem.id = currentItem.id;
             $scope.currentItem.userName = currentItem.userName;
             $scope.currentItem.name = currentItem.name;
             $scope.currentItem.rating = currentItem.rating;*/
        };

        $scope.__getItemsQuery = function (params) {
            return null; //userService.getList(params);
        };

        $scope.__getCreateItemSuccessMessage = function (item) {
            return null; //"Клиент " + item.userName + " создан успешно";
        };

        $scope.__getEditItemSuccessMessage = function (item) {
            return null; //"Клиент " + item.userName + " изменен успешно";
        };

        $scope.__getDeleteItemSuccessMessage = function (item) {
            return null; //"Клиент " + item.userName + " удален успешно";
        };

        $scope.__prepareItems = function (items) {
            return items;
        };

        $scope.__beforeInit = function () {

        };

        $scope.__beforeShowEdit = function (item) {
            return true;
        };

        $scope.__afterCancelEdit = function () {

        };

        $scope.__afterDelete = function (currentItem) {
            vm.deleteItemFromList(currentItem.id, $scope.items);
        };

        $scope.init = function () {
            $scope.__beforeInit();

            $scope.sortFieldName = $scope.__getDefaultSortFieldName();

            $scope.searchItems();
        };

        $scope.currentDate = new Date();

        $scope.getMinDateDefault = function () {
            return new Date($scope.currentDate.getFullYear() - 2, 5, 22);
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: $scope.currentDate,
            minDate: $scope.getMinDateDefault(),
            startingDay: 1,
            showWeeks: false
        };

        vm.showEditModal = function (item) {
            var result = $scope.__beforeShowEdit(item);

            if (!result) {
                return;
            }

            if (item) {
                $scope.currentItem = item;
            } else {
                $scope.currentItem = {};
            }

            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.__editTemplateUrl,
                controller: $scope.__editControllerName,
                controllerAs: 'vm',
                resolve: $scope.__transmitDataToEditController()
            });

            modalInstance.result
                    .then(function (currentItem) {
                        vm.showSaveSuccessMessage(currentItem);
                        $scope.__updateItemLocaly(currentItem);
                        if (!$scope.currentItem || !$scope.currentItem.id) {
                            $scope.items.push(currentItem);
                            $scope.countItemsTotal++;
                        } else {
                            $scope.__updateItemLocaly(currentItem);
                        }

                        $scope.sortList();
                    }, function () {
                    });

            modalInstance.result.catch(function (res) {
                $scope.__afterCancelEdit();
            })
        };


        vm.showDeleteModal = function (item) {
            $scope.currentItem = item;

            var modalInstance = $uibModal.open({
                animation: vm.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: $scope.__deleteTemplateUrl,
                controller: $scope.__deleteControllerName,
                controllerAs: 'vm',
                resolve: $scope.__transmitDataToDeleteController()
            });

            modalInstance.result.then(function (currentItem) {
                vm.showDeleteSuccessMessage(currentItem);
                $scope.currentItem = null;
                $scope.__afterDelete(currentItem);
            }, function () {
            });
        };

        vm.deleteItemFromList = function (id, items) {
            if ($scope.countItemsTotal > 0) {
                $scope.countItemsTotal--;
            }

            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    items.splice(i, 1);
                    return;
                }

                if (items[i].children && items[i].children[0]) {
                    for (var j = 0; j < items[i].children.length; j++) {
                        if (items[i].children[j].id == id) {
                            items[i].children.splice(j, 1);
                            return;
                        }
                    }

                    vm.deleteItemFromList(id, items[i].children);
                }
            }
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
                        $scope.sortList();

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

        $scope.changeSortList = function (sortFieldName) {
            if (!$scope.items || !$scope.items.length) {
                return;
            }

            if (sortFieldName && $scope.sortFieldName != sortFieldName) {
                $scope.sortModeAsc = true;
            } else {
                $scope.sortModeAsc = !$scope.sortModeAsc;
            }

            $scope.sortList(sortFieldName);
        };

        $scope.sortList = function (sortFieldName) {
            if (!$scope.items || !$scope.items.length) {
                return;
            }

            if (sortFieldName && $scope.sortFieldName != sortFieldName) {
                $scope.sortFieldName = sortFieldName;
            }

            if (!$scope.sortFieldName) {
                return;
            }

            if (vm.hasIntFields() && $scope.sortFieldName.toLowerCase().indexOf('date') === -1) {
                $scope.items.sort(function (a, b) {
                    var a = parseInt(a[$scope.sortFieldName]);
                    var b = parseInt(b[$scope.sortFieldName]);

                    if (!a) {
                        a = 0;
                    }

                    if (!b) {
                        b = 0;
                    }

                    if ($scope.sortModeAsc) {
                        return a - b;
                    }

                    return b - a;
                });
            } else {
                $scope.items.sort(function (a, b) {
                    if ($scope.sortModeAsc) {
                        return (a[$scope.sortFieldName] + '').localeCompare(b[$scope.sortFieldName] + '');
                    }

                    return (b[$scope.sortFieldName] + '').localeCompare(a[$scope.sortFieldName] + '');
                });
            }

            $timeout(function () {
                $scope.$apply();
            }, 1000);
        };

        $scope.isChevronDown = function (fieldName) {
            return $scope.sortModeAsc || $scope.sortFieldName != fieldName;
        };

        $scope.isChevronUp = function (fieldName) {
            return !$scope.isChevronDown(fieldName);
        };

        $scope.setMultiselectSearchField = function (event, fieldName) {
            if (!event || !event.target || !fieldName) {
                return;
            }

            $scope.searchForm[fieldName] = [];

            for (var i = 0; i < event.target.selectedOptions.length; i++) {
                $scope.searchForm[fieldName].push(event.target.selectedOptions[i].value);
            }
        };

        $scope.setSelectSearchField = function (event, fieldName) {
            if (!event || !event.target || !fieldName) {
                return;
            }

            $scope.searchForm[fieldName] = '';

            for (var i = 0; i < event.target.selectedOptions.length; i++) {
                var value = event.target.selectedOptions[i].value;

                if (event.target.selectedOptions[i].value == 'true') {
                    value = true;
                } else if (event.target.selectedOptions[i].value == 'false') {
                    value = false;
                } else if (event.target.selectedOptions[i].value == 'null') {
                    delete $scope.searchForm[fieldName];
                    return;
                }

                $scope.searchForm[fieldName] = value;
            }
        };

        $scope.flushSearchForm = function () {
            if (!$scope.searchForm) {
                return;
            }

            $scope.searchForm = {};
            
            var selects = document.getElementsByTagName('select');
            
            if (!selects || !selects.length) {
                return;
            }
            
            for (var i = 0; i < selects.length; i++) {
                $scope.clearSelected(selects[i]);
            }
        };

        $scope.clearSelected = function (selectElement) {
            if (!selectElement) {
                return;
            }
            
            var elements = selectElement.options;
            
            if (!elements || !elements.length) {
                return;
            }

            for (var i = 0; i < elements.length; i++) {
                elements[i].selected = false;
            }
        };

        vm.hasIntFields = function () {
            for (var i = 0; i < $scope.items.length; i++) {
                if (parseInt($scope.items[i][$scope.sortFieldName]) > 0) {
                    return true;
                }
            }

            return false;
        };

        vm.showSaveSuccessMessage = function (item) {
            var successMessage = '';

            if (!$scope.currentItem || !$scope.currentItem.id) {
                successMessage = $scope.__getCreateItemSuccessMessage(item);
            } else {
                successMessage = $scope.__getEditItemSuccessMessage(item);
            }

            vm.showSuccessMessage(successMessage);
        };

        vm.showDeleteSuccessMessage = function (item) {
            var successMessage = '';

            if ($scope.currentItem.title) {
                successMessage = $scope.__getDeleteItemSuccessMessage();
            }

            vm.showSuccessMessage(successMessage);
        };

        vm.showSuccessMessage = function (successMessage) {
            if (successMessage) {
                $scope.successMessage = successMessage;
            }

            $timeout(function () {
                $scope.successMessage = null;
            }, vm.showMessageDelay);
        };
    }]);