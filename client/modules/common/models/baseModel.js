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
        
        return BaseModel;
    }])

