'use strict';
atomTestApp.factory('Book', ['BaseModel', function (BaseModel) {

        function Book(data) {
            data && this.configure(data);
        }

        Book.prototype = Object.create(BaseModel.prototype);

        return Book;
    }])

