'use strict';
atomTestApp.service("bookService", [
    '$api', 'ROUTES', 'Book',
    function ($api, ROUTES, Book) {
        var service = {};
        service.urlHash = 'books';
        service.titleList = 'Books';
        service.title = 'Book';
        service.oldestBookYear = 1400;

        service.getUrl = function () {
            return ROUTES.HASH_KEY + service.urlHash;
        };

        service.getList = function (params) {
            return $api.get(service.urlHash, params);
        };

        service.getById = function (bookId) {
            if (!bookId) {
                return;
            }

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

        service.isValidYear = function (year) {
            if (!year) {
                return false;
            }

            year = parseInt(year);
            var currentDate = new Date();

            if (year > currentDate.getFullYear() || year < service.oldestBookYear) {
                return false;
            }

            return true;
        };
        
        service.formatIsbn = function (isbn) {
            if (!isbn) {
                return;
            }
            
            return isbn.trim().replace(/[^0-9]+/g, "");
        };

        service.formatName = function (book) {
            if (!book || !book.name) {
                return '';
            }

            return service.title + ' ' + book.name;
        };

        return service;
    }]);


