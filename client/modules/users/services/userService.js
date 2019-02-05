'use strict';
atomTestApp.service("userService", [
    'authService', '$api', 'emailService', 'User',
    function (authService, $api, emailService, User) {
        var service = {};

        service.urlHash = 'users';
        service.title = 'User';

        service.anUpperCase = /[A-Z]/;
        service.aLowerCase = /[a-z]/;
        service.aNumber = /[0-9]/;
        service.aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
        service.minLength = 8;

        service.create = function (data) {
            var user = new User(data);
            
            if (!service.isValid(user) || !service.isEaqualPasswords(data)) {
                return;
            }
            
            return $api.post(service.urlHash, user).then(
                    function (response) {
                        if (!response || !response.data.access_token) {
                            return;
                        }

                        authService.setAuthorizedState(response.data.access_token, response.data.id);
                    },
                    function (response) {

                    }
            );
        };
        
        service.isValid = function (user) {
            if (!user.first_name || !user.last_name || !user.userName || !user.email || !emailService.validate(user.email)) {
                return false;
            }
            
            return true;
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

        service.checkEmail = function (email) {
            return emailService.validate(email);
        };

        return service;
    }]);


