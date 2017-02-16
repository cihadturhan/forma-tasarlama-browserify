'use strict';
var host = require('../util/constants').backendHost;

module.exports = function($http, $q, $timeout){

    var uniformTypes = [
    ];

    this.getAll = function () {
        console.log('uniformtypes started', performance.now());
        if(uniformTypes.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:uniformTypes});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/forma-tipleri');
            promise.then(function (response) {
                uniformTypes = response.data;
                console.log('uniformtypes ended', performance.now());
            });
            return promise;
        }

    };

    this.get = function (uid) {
        return uniformTypes.find(function (c) {
            return c.uid == uid
        });
    };

    this.getElements = function(){
        return uniformTypes;
    }
};