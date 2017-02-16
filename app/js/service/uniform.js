'use strict';
var host = require('../util/constants').backendHost;

module.exports = function($http, $q, $timeout){

    var uniforms = [
    ];

    this.getAll = function () {
        console.log('uniform started', performance.now());
        if(uniforms.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:uniforms});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/formalar');
            promise.then(function (response) {
                uniforms = response.data;
                console.log('uniform ended', performance.now());
            });
            return promise;
        }

    };

    this.get = function (uid) {
        return uniforms.find(function (c) {
            return c.uid == uid
        });
    }
};