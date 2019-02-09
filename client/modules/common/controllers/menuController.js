'use strict';
atomTestApp.controller('menuController', [
    'authService', 'loginService', 'bookService', 'menuService',
    function (authService, loginService, bookService, menuService) {
        var vm = this;
        
        vm.loginService = loginService;
        vm.authService = authService;
        vm.menuService = menuService;
        vm.bookService = bookService;
        
        vm.selectMenuItem = function (urlHash) {
            vm.menuService.currentUrlHash = urlHash;
        };

        vm.isActiveMenuItem = function (urlHash) {
            return vm.menuService.getCurrentUrlHash() == urlHash;
        };

        vm.init = function () {
            if (!vm.menuService.currentUrlHash) {
                vm.menuService.currentUrlHash = vm.catalogueService.urlHash;
            }
        };
    }]);


