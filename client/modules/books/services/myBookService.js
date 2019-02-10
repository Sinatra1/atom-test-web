'use strict';
atomTestApp.service("myBookService", [
    '$api', 'ROUTES',
    function ($api, ROUTES) {
        var service = {};
        service.urlHash = 'my-books';
        service.titleList = 'My books';
        service.title = 'My book';

        service.getUrl = function () {
            return ROUTES.HASH_KEY + service.urlHash;
        };

        service.getList = function (params) {
            return $api.get(service.urlHash, params);
        };

        service.add = function (bookId) {
            if (!bookId) {
                return;
            }

            return $api.post(service.urlHash + '/' + bookId);
        };

        service.remove = function (bookId) {
            if (!bookId) {
                return;
            }

            return $api.delete(service.urlHash + '/' + bookId);
        };

        return service;
    }]);


