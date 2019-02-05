'use strict';
atomTestApp.service("emailService", [function () {
        var service = {};

        service.validate = function (value) {

            if (typeof value === 'undefined' || value === null || value === '') {
                return true;
            }

            var regexp = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;

            if (regexp.test(value)) {
                return true;
            }

            return false;
        };

        return service;
    }]);


