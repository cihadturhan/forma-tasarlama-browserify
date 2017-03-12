'use strict';

angular.module('main').controller('collarCtrl', function ($scope, collarService) {
    collarService.getAll().then(function successCallback(response){
        $scope.collars = response.data;
    }).catch(function (e) {
        console.log(e);
        throw e;
    });
});


