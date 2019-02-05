'use strict';
atomTestApp.service("regService", [
    'authService', 'userService',
    function (authService, userService) {
        var service = {};

        service.urlHash = 'auths';
        service.title = 'Sign up';

        service.regUser = function (user) {
            if (authService.isAuth()) {
                return;
            }
            
            return userService.create(user);
        };

        return service;
    }]);


