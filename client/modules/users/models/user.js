'use strict';
atomTestApp.factory('User', ['BaseModel', function (BaseModel) {

        function User(data) {
            data && this.configure(data);
        }

        User.prototype = Object.create(BaseModel.prototype);
        
        User.prototype.first_name = null;
        User.prototype.last_name = null;
        User.prototype.username = null;
        User.prototype.email = null;
        User.prototype.password = null;
        
        return User;
    }])

