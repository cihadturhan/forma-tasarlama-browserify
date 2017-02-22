'use strict';

var host = require('../util/constants').backendHost;

module.exports = function ($http, $q, $timeout) {

    var caches = {};

    this.set = function (uid, data) {
        caches[uid] = data;
        //window.localStorage.set(uid, JSON.stringify(data));
    };

    this.get = function (uid) {
        return caches[uid];
    }
};