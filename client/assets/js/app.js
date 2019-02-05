'use strict';

var atomTestApp = angular.module('atomTestApp', [
    'ngRoute',
    'ngCookies',
    'ui.bootstrap.modal'
]).constant('SETTINGS', {
    AUTO_LOGOUT_TIMEOUT: 30000,
    AUTO_LOGOUT_TIMEOUT_POPUP: 30
}).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);