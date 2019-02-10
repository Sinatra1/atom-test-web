'use strict';
atomTestApp.factory('Book', ['BaseModel', function (BaseModel) {

        function Book(data) {
            data && this.configure(data);
        }

        Book.prototype = Object.create(BaseModel.prototype);
        
        Book.prototype.created_user_id = null;
        Book.prototype.name = null;
        Book.prototype.isbn = null;
        Book.prototype.year = null;
        Book.prototype.description = null;
        Book.prototype.cover_image = null;

        return Book;
    }])

