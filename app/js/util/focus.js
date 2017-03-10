'use strict';

var constants =  require('../util/constants');
var sizes = constants.sizes;
var faces = constants.faces;

module.exports = {
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
        transform: {x: sizes.wHalf, y: 1200},
        scale: 3,
        face: faces.FRONT
    },
    sponsor: {
        transform: {x: sizes.wHalf, y: 1700},
        scale: 2,
        face: faces.FRONT
    },
    backNumber: {
        transform: {x: sizes.wHalf, y: 1700},
        scale: 2,
        face: faces.BACK
    }
};