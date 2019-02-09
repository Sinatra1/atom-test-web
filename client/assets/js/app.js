'use strict';

var atomTestApp = angular.module('atomTestApp', [
    'ngRoute',
    'ngCookies',
    'ui.bootstrap.modal',
    'ui.bootstrap.dropdown',
    'ui.mask',
    'ja.isbn'
]).constant('SETTINGS', {
    TOKEN_EXPIRES_DELAY_SEC: 30 * 1000 * 60,
    IMAGES_FOLDER_NAME: '../images'
}).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);