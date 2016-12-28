'use strict';


module.exports = function ($scope, collarService) {
    $scope.collars = collarService.getAll();
};


