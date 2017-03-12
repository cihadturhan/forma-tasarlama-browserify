'use strict';
var host = require('../util/constants').backendHost;

angular.module('main').service('gkUniformService', function($http, $q, $timeout){

    var gkUniforms = [
    ];

    this.getAll = function () {
        if(gkUniforms.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:gkUniforms});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/kaleci-formalari');
            promise.then(function (response) {
                gkUniforms = response.data;
            });
            return promise;
        }

    };

    this.get = function (uid) {
        return gkUniforms.find(function (c) {
            return c.uid == uid
        });
    }
});