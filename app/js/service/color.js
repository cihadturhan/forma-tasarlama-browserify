'use strict';
var host = require('../util/constants').backendHost;

module.exports = function($http, $q, $timeout){

    var colors = [];

    this.getAll = function () {
        if(colors.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:colors});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/renkler');
            promise.then(function (response) {
                colors = response.data;
            });
            return promise;
        }

    };

    this.get = function (name) {
        return colors.find(function (c) {
            return c.name.toLowerCase() == name.toLowerCase()
        });
    }
};