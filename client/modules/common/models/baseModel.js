'use strict';
atomTestApp.factory('BaseModel', [function () {

        function BaseModel() {

            var data = {};

            this.configure(data);
        }

        BaseModel.prototype = {
            configure: function (data) {
                angular.extend(this, data);

                this.init();
            },
            init: function () {

            }
        };
        
        BaseModel.prototype.id = null;
        BaseModel.prototype.created = null;
        BaseModel.prototype.updated = null;
        
        return BaseModel;
    }])

