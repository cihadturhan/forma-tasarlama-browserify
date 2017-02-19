'use strict';
var host = require('../util/constants').backendHost;

module.exports = function($http, $q, $timeout, Upload){

    var logos = [
    ];

    this.getAll = function () {
        if(logos.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data:logos});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/logolar/');
            promise.then(function (response) {
                logos = response.data;
            });
            return promise;
        }

    };

    this.get = function (name) {
        return logos.find(function (c) {
            return c.logo_ismi == name
        });
    };

    this.set = function(name, file){
        Upload.upload({
            url: 'http://formatasarlama/siparisler',//host + '/wp-admin/admin-ajax.php',
            data: {
                file: file
            }
        }).then(function(){
            console.log(arguments);
        }).catch(function(){
            console.error(arguments);
        })
    }
};