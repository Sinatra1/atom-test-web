'use strict';
atomTestApp.controller('menuController', [
    'authService',
    'loginService',
    'menuService',
    'bookService',
    'myBookService',
    'userService',
    function (
            authService,
            loginService,
            menuService,
            bookService,
            myBookService,
            userService
            ) {

        var vm = this;

        vm.authService = authService;
        vm.loginService = loginService;
        vm.menuService = menuService;
        vm.bookService = bookService;
        vm.myBookService = myBookService;
        vm.userService = userService;
        
        vm.selectMenuItem = function (urlHash) {
            vm.menuService.currentUrlHash = urlHash;
        };

        vm.isActiveMenuItem = function (urlHash) {
            return vm.menuService.getCurrentUrlHash() == urlHash;
        };

        vm.init = function () {
            if (!vm.menuService.currentUrlHash) {
                vm.menuService.currentUrlHash = vm.bookService.urlHash;
            }
        };

        vm.init();
    }]);