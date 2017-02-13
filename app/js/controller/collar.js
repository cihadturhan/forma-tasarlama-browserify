'use strict';

module.exports = function ($scope, collarService) {
    collarService.getAll().then(function successCallback(response){
        $scope.collars = response.data;
    }).catch(function (e) {
        console.log(e);
        throw e;
    });
};


