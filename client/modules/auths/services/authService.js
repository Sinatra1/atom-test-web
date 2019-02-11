'use strict';
atomTestApp.service('authService', [
    '$rootScope', '$cookies', 'ROUTES', 'SETTINGS',
    function ($rootScope, $cookies, ROUTES, SETTINGS) {
        var service = this;

        var defaultUser = {token: null, id: null};
        service.currentUser = angular.copy(defaultUser);
        service.authorized = null;
        service.CURRENT_USER_KEY_NAME = 'fields';

        service.setAuthorizedState = function (token, userId) {
            if (!token || !userId) {
                return;
            }

            service.setCurrentUser(token, userId);

            if (service.authorized !== true) {
                $rootScope.$emit('Authorized');
            }
        };

        service.setCurrentUser = function (token, userId) {
            service.currentUser.token = token;
            service.currentUser.id = userId;

            service.authorized = true;

            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + SETTINGS.TOKEN_EXPIRES_DELAY_SEC);
            
            $cookies.putObject(service.CURRENT_USER_KEY_NAME, service.currentUser, {expires: expireDate});
        };

        service.removeCurrentUser = function () {
            service.authorized = false;
            
            $cookies.remove(service.CURRENT_USER_KEY_NAME);
        };

        service.getCurrentUser = function () {
            if (service.currentUser.token) {
                service.authorized = true;
                return service.currentUser;
            }

            service.currentUser = $cookies.getObject(service.CURRENT_USER_KEY_NAME);
            
            if (typeof service.currentUser !== 'object') {
                service.currentUser = angular.copy(defaultUser);
            }

            if (service.currentUser.token) {
                service.authorized = true;
            }

            return service.currentUser;
        };

        service.setUnauthorizedState = function () {
            $rootScope.hidePreuserName = false;

            service.removeCurrentUser();
            
            $rootScope.$emit('Unauthorized');
            
            top.location.href = ROUTES.PRELOGIN;
        };

        service.isAuth = function () {
            if (service.authorized === true) {
                return true;
            }

            if (service.getCurrentUser().token) {
                service.authorized = true;
                return service.authorized;
            }
            
            service.authorized = false;

            return service.authorized;
        };
    }])

