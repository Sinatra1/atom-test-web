'use strict';
atomTestApp.filter('integer', function () {
    return function (value) {
        return value.replace(/[^\d]/g, '');
    };
}).directive('integer', ['$filter', '$timeout', function ($filter, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var isSpecialKey = function (e) {
                    return (e.ctrlKey || e.metaKey ||
                            (e.keyCode > 105 && e.keyCode <= 96 && e.keyCode !== 8));
                };

                var inputFormat = function (e) {
                    if (element.attr('data-is_validated')) {
                        element.removeAttr('data-is_validated');
                        return true;
                    }

                    if (e !== undefined && e.key !== undefined) {
                        if (isSpecialKey(e) && !e.key.match(new RegExp('\\d'))) {
                            // Prevent data input
                            return false;
                        }
                    }

                    var value = element.val();

                    if (!value && value !== '0') {
                        value = '';
                    }

                    var formatted = $filter('integer')(value);

                    formatted = formatted.trim();

                    element.val(formatted);
                    element.attr('data-is_validated', 'true');
                    element.triggerHandler('change');

                    return true;
                };

                $timeout(function () {
                    if (element.attr('integer') !== undefined) {
                        element.on('keyup', inputFormat);
                        element.on('keydown', inputFormat);
                        element.on('focus', inputFormat);
                    }
                });
            }
        }
    }]);


