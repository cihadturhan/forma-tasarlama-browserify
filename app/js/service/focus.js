'use strict';

var sizes =  require('../util/constants');

module.exports = function($http){
    this.get = function() {
        return {
            infinity: {
                transform: {x: sizes.wHalf, y: sizes.hHalf},
                scale: 0
            },
            body: {
                transform: {x: sizes.wHalf, y: sizes.hHalf},
                scale: 1
            },
            tshirt: {
                transform: {x: sizes.wHalf, y: 1700},
                scale: 2
            },
            shorts: {
                transform: {x: sizes.wHalf, y: 3100},
                scale: 2
            },
            socks: {
                transform: {x: sizes.wHalf, y: 4300},
                scale: 2
            },
            logo: {
                transform: {x: 2300, y: 1200},
                scale: 3
            }
        };
    }
};