'use strict';
atomTestApp.service("imageService", [
    '$api', 'ROUTES', 'SETTINGS', 'guidService', '$q',
    function ($api, ROUTES, SETTINGS, guidService, $q) {
        var service = {};

        service.urlHash = 'images';
        service.imagesId = [];

        service.getById = function (imageId) {
            if (!imageId) {
                return;
            }

            return $api.get(service.urlHash + '/' + imageId);
        };

        service.isImageFormat = function (file) {
            if (file.type.indexOf('image') != -1 && (file.name.indexOf('jpg') != -1 || file.name.indexOf('png') != -1 || file.name.indexOf('jpeg') != -1 || file.name.indexOf('gif') != -1)) {
                return true;
            }

            return false;
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


