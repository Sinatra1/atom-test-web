'use strict';
atomTestApp.factory('$api', ['$http', '$q', 'authService', 'ROUTES', function ($http, $q, authService, ROUTES) {

        function getMethodUrl(method, httpMethod, data, config) {
            var url = ROUTES.API_URL;

            if (config != null && config.apiUrl != null) {
                url = config.apiUrl;
            }

            url += method;

            if (httpMethod == "GET" || httpMethod == "DELETE") {
                angular.forEach(data, function (value, key) {
                    var delimiter = "?";

                    if (url.indexOf(delimiter) !== -1) {
                        delimiter = "&";
                    }

                    url += delimiter + key + "=" + encodeURIComponent(value);
                });
            }

            return url;
        }

        function request(method, httpMethod, withCredentials, context, config, data) {
            if (withCredentials === null) {
                withCredentials = true;
            }

            var deferred = $q.defer();
            
            var headers = {};
            
            if (data != null && data.files != null) {
                headers['Content-Type'] = undefined;
                data = data.files;
            }

            $http(angular.extend({
                method: httpMethod,
                url: getMethodUrl(method, httpMethod, data, config),
                data: data,
                withCredentials: withCredentials,
                headers: headers
            }, config)).then(function (response) {
                if (response.data.errorMessage) {
                    deferred.reject(response);
                } else {
                    deferred.resolve(response);
                }
            }, function (response) {
                if (context && angular.isFunction(context.preProcessResponse)) {
                    context.preProcessResponse(response);
                }
                switch (response.status) {
                    case 401:
                        deferred.reject(response);
                        authService.setUnauthorizedState();
                        break;
                    default:
                        deferred.reject(response);
                }
                deferred.reject(response);
            });

            return deferred.promise;
        }

        function get(method, data, withCredentials, context, config) {
            return request(method, 'GET', withCredentials, context, config, data);
        }

        function del(method, data, withCredentials, context, config) {
            return request(method, 'DELETE', withCredentials, context, config, data);
        }

        function head(method, withCredentials, context, config) {
            return request(method, 'HEAD', withCredentials, context, config);
        }

        function post(method, data, withCredentials, context, config) {
            return request(method, 'POST', withCredentials, context, config, data);
        }

        function put(method, data, withCredentials, context, config) {
            return request(method, 'PUT', withCredentials, context, config, data);
        }

        function patch(method, data, withCredentials, context, config) {
            return request(method, 'PATCH', withCredentials, context, config, data);
        }

        return {
            get: get,
            delete: del,
            head: head,
            post: post,
            put: put,
            patch: patch,
            getMethodUrl: getMethodUrl
        };

    }]);

