'use strict';
atomTestApp.service("imageService", [
    '$api', 'ROUTES', 'SETTINGS', 'guidService', '$q',
    function ($api, ROUTES, SETTINGS, guidService, $q) {
        var service = {};

        service.urlHash = 'images';
        service.imagesId = [];
        service.allowedExtentions = ['jpg', 'png', 'jpeg', 'gif'];
        service.maxSize = 2 * 1024 * 1024; //2Mb

        service.getById = function (imageId) {
            if (!imageId) {
                return;
            }

            return $api.get(service.urlHash + '/' + imageId);
        };

        service.isImageFormat = function (file) {
            if (!file) {
                return false;
            }
            
            var name = file.name.toLowerCase();
            
            if (file.type.indexOf('image') === -1) {
                return false;
            }
            
            var isAllowedExtention = false;
            
            for (var i = 0; i < service.allowedExtentions.length; i++) {
                if (name.indexOf(service.allowedExtentions[i]) !== -1) {
                    isAllowedExtention = true;
                }
            }

            return isAllowedExtention;
        };
        
        service.isAllowedFileSize = function (file) {
            if (!file) {
                return false;
            }
            
            return file.size <= service.maxSize;
        };

        service.getImageUrlById = function (imageId) {
            if (!imageId) {
                return;
            }

            return ROUTES.API_URL + SETTINGS.IMAGES_FOLDER_NAME + '/' + imageId;
        };

        service.create = function (imageFile) {
            if (!imageFile) {
                return;
            }

            var data = {};
            data.file = imageFile;
            data.file.filename = guidService.generate();
            data.withOutAuthorization = true;

            return $api.post(service.urlHash, data, true, null, {apiUrl: ROUTES.API_URL_REMOTE});
        };

        service.createImages = function (imagesFiles) {
            if (!imagesFiles || !(imagesFiles.length > 0)) {
                return;
            }

            var data = {};

            data.files = new FormData();

            for (var i = 0; i < imagesFiles.length; i++) {
                imagesFiles[i].filename = guidService.generate();
                data.files.append(imagesFiles[i].filename, imagesFiles[i]);
            }
            
            var deferred = $q.defer();
            
            data.withOutAuthorization = true;

            $api.post(service.urlHash, data, false, null, {apiUrl: ROUTES.API_URL_REMOTE}).then(
                    function (response) {
                        deferred.resolve(response.data);
                    },
                    function (response) {
                        deferred.reject(response);
                    }
            );

            return deferred.promise;
        };

        return service;
    }]);


