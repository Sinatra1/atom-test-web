'use strict';
atomTestApp.controller('editModalItemController', [
    '$scope', '$controller', '$uibModalInstance',
    function ($scope, $controller, $uibModalInstance) {
        
        angular.extend(this, $controller('editItemController', {$scope: $scope}));
        
        $scope.__close = function (item) {
            $uibModalInstance.close(item);
        };
        
        $scope.__cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);