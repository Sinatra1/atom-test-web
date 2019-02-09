'use strict';
atomTestApp.service("menuService", [
    '$location',
    function ($location) {
        var service = {};
        
        service.currentUrlHash = null;
        
        service.getCurrentUrlHash = function () {
            return $location.path().split('/')[1];
        };

        return service;
    }]);


