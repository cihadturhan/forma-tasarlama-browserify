'use strict';
var host = require('../util/constants').backendHost;

angular.module('main').service('shortService', function($http, $q, $timeout){

    var shorts = [];

    this.getAll = function () {
        if(shorts.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:shorts});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/sortlar');
            promise.then(function (response) {
                shorts = response.data;
            });
            return promise;
        }

    };

    this.get = function (uid) {
        return shorts.find(function (c) {
            return c.uid == uid
        });
    }
});