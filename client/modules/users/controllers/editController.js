'use strict';
atomTestApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/users', {
                    controller: 'editUserController',
                    controllerAs: 'editUserVm',
                    templateUrl: 'modules/users/views/edit.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/reg', {
                    controller: 'editUserController',
                    controllerAs: 'editUserVm',
                    templateUrl: 'modules/users/views/reg.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]).controller('editUserController', [
    '$scope', '$controller', '$routeParams', '$location', 'userService', 'bookService', 'loginService', 'authService',
    function ($scope, $controller, $routeParams, $location, userService, bookService, loginService, authService) {

        angular.extend(this, $controller('editItemController', {$scope: $scope}));

        var vm = this;

        $scope.userService = userService;
        $scope.loginService = loginService;
        $scope.isRegMode = true;
        $scope.buttonTitle = userService.regTitle;

        if (location.hash.indexOf(userService.urlHash) !== -1) {
            $scope.isRegMode = false;
            $scope.buttonTitle = 'Save';
        }

        if (!$scope.isRegMode && !$scope.authService.isAuth()) {
            $location.path('/');
            return;
        }

        $scope.__deleteTemplateUrl = 'modules/common/views/deleteModal.html';
        $scope.__deleteControllerName = 'deleteUserController';

        $scope.__getEditCurrentItemTitle = function () {
            return userService.titleList;
        };

        $scope.__getItemByIdQuery = function (id) {
            return userService.getProfile();
        };

        $scope.__updateItemQuery = function () {
            var data = vm.prepareUserForRequest();

            if ($scope.currentItem.id) {
                return userService.update(data);
            }

            if (authService.isAuth()) {
                return;
            }

            return userService.create(data);
        };

        $scope.__transmitDataToDeleteController = function () {
            return {
                currentUser: function () {
                    return angular.copy($scope.currentItem);
                }
            };
        };

        $scope.__afterDelete = function (currentItem) {
            $location.path('/');
        };

        vm.prepareUserForRequest = function () {

            return angular.copy($scope.currentItem);
        };

        $scope.__close = function (id) {
            if (!id) {
                return;
            }

            $location.path('/' + bookService.urlHash);
        };

        $scope.isValidForm = function (editForm) {
            return (!editForm.$invalid && !$scope.firstNameError && !$scope.lastNameError && !$scope.usernameError && !$scope.emailError && !$scope.passwordError && !$scope.passwordTwiceError);
        };

        $scope.validatePassword = function (editForm) {
            $scope.passwordError = editForm.password.$dirty && editForm.password && !userService.isPasswordComplex($scope.currentItem.password);

            $scope.validatePasswordTwice(editForm);
        };

        $scope.validatePasswordTwice = function (editForm) {
            $scope.passwordTwiceError = editForm.passwordTwice.$dirty && editForm.passwordTwice && !userService.isEaqualPasswords($scope.currentItem);
        };

        if (!$scope.isRegMode) {
            $scope.getCurrentItemById($scope.authService.currentUser.id);
        } else {
            $scope.init();
        }
    }]);