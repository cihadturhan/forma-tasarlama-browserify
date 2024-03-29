
'use strict';

var host = require('../util/constants').backendHost;

var constants = require('../util/constants.js');
var focus = require('../util/focus');

angular.module('main').service('collarTypesService', function ($http, $q, $rootScope, colorService, $timeout) {

    var collarTypes = [

    ];

    this.getAll = function () {
        if(collarTypes.length){
            var deferred = $q.defer();
            $timeout(function () {
                deferred.resolve({data: collarTypes});
            },1);
            return deferred.promise;
        }else {
            var promise = $http.get(host + '/forma-tipleri');
            promise.then(function (response) {
                collarTypes = response.data;
            });
            return promise;
        }

    };

    this.get = function(model){
        return collarTypes.find(function (c) {
            return c.tip == model;
        });
    };

    function getLayers(uniform, face){
        return {
            base: $rootScope.getUrl(uniform, 'base_' + face),
            smarts: $rootScope.getUrl(uniform, 'smarts_bg_' + face),
            socks: $rootScope.getUrl(uniform, 'socks_' + face),
            uniformHighlights: $rootScope.getUrl(uniform, 'uniform_highlights_' + face),
            uniformShadows: $rootScope.getUrl(uniform, 'uniform_shadows_' + face),
            uniform: $rootScope.getUrl(uniform, 'uniform_' + face),
            shorts: $rootScope.getUrl(uniform, 'shorts_' + face)
        };
    };

    this.getFront = function (uniform) {

        return {
            name: 'front',
            position: {
                x: constants.container.wHalf,
                y: constants.container.hHalf
            },
            layers: getLayers(uniform, 'front'),
            extras: {
                texts: [],
                logos: [{image: 'logos/adidas.png', position: focus.logo.transform}]
            }
        };
    };

    this.getBack = function (uniform) {
        return {
            name: 'back',
            position: {
                x: constants.container.wHalf * 6,
                y: constants.container.hHalf
            },
            layers: getLayers(uniform, 'back'),
            extras: {
                texts: [],
                logos: []
            }
        };
    }
});