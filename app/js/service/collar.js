'use strict';

var host = require('../util/constants').backendHost;

module.exports = function ($http, $q, $timeout) {

    var collars = [

    ];



    this.getAll = function () {
        if(collars.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:collars});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/yaka-tipleri');
            promise.then(function (response) {
                collars = response.data;
            });
            return promise;
        }

    };

    this.get = function (uid) {
        return collars.find(function (c) {
            return c.uid == uid;
        });
    }
};