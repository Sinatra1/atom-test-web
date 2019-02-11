'use strict';
atomTestApp.service("loginService", [
    'authService', '$api', '$q',
    function (authService, $api, $q) {
        var service = {};

        service.urlHash = 'auths';
        service.title = 'Sign in';

        service.anUpperCase = /[A-Z]/;
        service.aLowerCase = /[a-z]/;
        service.aNumber = /[0-9]/;
        service.aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
        service.minLength = 8;

        service.loginUser = function (user) {
            var deferred = $q.defer();

            $api.post(service.urlHash, user).then(
                    function (response) {
                        if (!response || !response.data.access_token) {
                            return;
                        }

                        authService.setAuthorizedState(response.data.access_token, response.data.id);

                        deferred.resolve(response);
                    },
                    function (response) {
                        deferred.reject(response);
                    }
            );

            return deferred.promise;
        };

        service.logoutUser = function () {
            var deferred = $q.defer();

            $api.delete(service.urlHash).then(
                    function (response) {
                        authService.setUnauthorizedState();

                        deferred.resolve(response);
                    },
                    function (response) {
                        deferred.reject(response);
                    }
            );

            return deferred.promise;
        };

        service.isEaqualPasswords = function (user) {

            if (user && user.password && user.password == user.passwordTwice) {
                return true;
            }

            return false;
        };

        service.isPasswordComplex = function (password) {
            if (!password ||
                    password.length < service.minLength ||
                    password.search(service.anUpperCase) == -1 ||
                    password.search(service.aLowerCase) == -1 ||
                    password.search(service.aNumber) == -1 ||
                    password.search(service.aSpecial) == -1)
            {
                return false;
            }

            return true;
        };

        return service;
    }]);


