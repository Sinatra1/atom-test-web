'use strict';
atomTestApp.controller('editItemController', [
    '$scope', '$timeout', '$uibModal', 'imageService', 'authService',
    function ($scope, $timeout, $uibModal, imageService, authService) {
        var vm = this;

        $scope.currentItem = {id: ""};
        $scope.currentItemTitle = null;
        $scope.isSingleImageMode = true;
        $scope.imageService = imageService;
        $scope.authService = authService;
        
        $scope.__deleteTemplateUrl = null; //'modules/users/views/deleteModal.html';
        $scope.__deleteControllerName = null; // 'deleteUserController';

        $scope.__getCreateCurrentItemTitle = function () {
            return null; //example "Create item";
        };

        $scope.__getEditCurrentItemTitle = function () {
            return null; //item title
        };

        $scope.__afterInit = function () {

        };

        $scope.__updateItemQuery = function () {
            return null;//example userService.update($scope.currentItem);
        };

        $scope.__getItemByIdQuery = function (id) {
            return null;//example userService.getById(id);
        };

        $scope.__close = function (item) {
            return item;
        };
        
        $scope.__onError = function (error) {
            return error;
        };
        
        $scope.__transmitDataToDeleteController = function () {
            return {};

            /*return {
             currentItem: function () {
             return angular.copy($scope.currentItem);
             }
             };*/
        };
        
        $scope.__afterDelete = function (currentItem) {
            //$location.path('/' + bookService.urlHash);
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
                $scope.currentItem = null;
                $scope.__afterDelete(currentItem);
            }, function () {
            });
        };

        $scope.init = function (currentItem) {
            if (currentItem) {
                $scope.currentItem = currentItem;
            }

            if (!currentItem || !currentItem.id) {
                $scope.currentItemTitle = $scope.__getCreateCurrentItemTitle();
            } else {
                $scope.currentItemTitle = $scope.__getEditCurrentItemTitle();
            }

            $scope.__afterInit();
        };

        $scope.updateItem = function () {
            $scope.showSpinner = true;
            $scope.setEditErrorMessage = false;
            
            $timeout(function () {
                var request = $scope.__updateItemQuery();

                if (!request) {
                    $scope.updateItemError();
                    return;
                }

                request.then(function (response) {
                    $scope.updateItemSuccess(response.data);
                }, function (response) {
                    $scope.updateItemError(response);
                });
            }, 1000);
        };

        $scope.updateItemSuccess = function (item) {
            $scope.showSpinner = false;
            $scope.setEditErrorMessage = false;
            $scope.__close(item);
        };

        $scope.updateItemError = function (error) {
            $scope.showSpinner = false;
            $scope.setEditErrorMessage = true;
            
            $scope.__onError(error);
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

        $scope.addImage = function () {
            vm.imageFileInput = document.getElementById('imageFileInput');
            vm.imageFileInput.click();
        };

        $scope.getImagePreview = function () {
            var file = vm.imageFileInput.files[0];
            
            $scope.selectImageSizeError = false;
            $scope.selectImageError = false;
            
            if (!imageService.isImageFormat(file)) {
                $scope.selectImageError = true;
                $scope.$apply();
                return;
            }
            
            if (!imageService.isAllowedFileSize(file)) {
                $scope.selectImageSizeError = true;
                $scope.$apply();
                return;
            }
            
            var reader = new FileReader();

            reader.onload = function (event) {
                if (!$scope.currentItem.newImages) {
                    $scope.currentItem.newImages = [];
                }

                $scope.currentItem.newImages.push(event.target.result);

                $scope.$apply();
            };

            reader.readAsDataURL(file);

            if (!$scope.currentItem.newImagesFiles) {
                $scope.currentItem.newImagesFiles = [];
            }

            $scope.currentItem.newImagesFiles.push(file);
        };

        $scope.deleteImage = function (index) {
            if (!$scope.currentItem.deleteImagesIds) {
                $scope.currentItem.deleteImagesIds = [];
            }

            $scope.currentItem.deleteImagesIds.push($scope.currentItem.imagesId[index]);

            $scope.currentItem.imagesId.splice(index, 1);
        };

        $scope.deleteNewImage = function (index) {
            $scope.currentItem.newImages.splice(index, 1);
            $scope.currentItem.newImagesFiles.splice(index, 1);
        };
    }]);