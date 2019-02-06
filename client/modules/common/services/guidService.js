'use strict';
atomTestApp.service("guidService", [
    function () {
        var service = {};

        service.generate = function () {
            var guid = new UUID(4).toString();
            return guid;
        };

        return service;
    }]);

