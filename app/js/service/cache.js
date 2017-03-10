'use strict';

var isLocal = false;require('../util/constants').isLocal;

module.exports = function ($http, $q, $timeout) {

    var caches = {};

    this.set = function (uid, data) {
        caches[uid] = data;

        /*if(!isLocal)
            return;

        data.chestLogos = [];
        data.logo1 = [];
        data.logo2 = [];
        window.sessionStorage.setItem(uid, JSON.stringify(data));*/
    };

    this.get = function (uid) {
        if(caches[uid])
            return caches[uid];

        /*if(!isLocal)
            return undefined;

        var lsData = window.sessionStorage.getItem(uid);

        if(lsData){
            try{
                return JSON.parse(lsData);
            }catch(e){
                return undefined;
            }
        }*/

    }
};