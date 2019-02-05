'use strict';
atomTestApp.service("bookService", [
    '$api', 'ROUTES', 'Book',
    function ($api, ROUTES, Book) {
        var service = {};
        service.urlHash = 'books';
        service.titleList = 'Books';
        service.title = 'Book';

        service.getUrl = function () {
            return ROUTES.HASH_KEY + service.urlHash;
        };

        service.getList = function (params) {
            return $api.get(service.urlHash, params);
        };

        service.getById = function (bookId) {
            return $api.get(service.urlHash + '/' + bookId);
        };

        service.update = function (data) {
            var request = service.urlHash;

            if (data.id) {
                request += '/' + data.id;

                return $api.put(request, new Book(data));
            }

            return $api.post(request, new Book(data));
        };

        service.delete = function (book) {
            return $api.delete(service.urlHash + '/' + book.id);
        };

        service.formatName = function (book) {
            if (!book || !book.name) {
                return '';
            }

            return book.name;
        };

        return service;
    }]);


