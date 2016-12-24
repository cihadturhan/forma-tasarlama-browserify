'use strict';

var constants = require('../util/constants.js');
var focus = require('../util/focus');

module.exports = function($http) {

    this.getFront = function() {
        return {
            name: 'front',
            position: {
                x: constants.container.wHalf,
                y: constants.container.hHalf
            },
            layers: {
                base: "img/front/base.png",
                smarts: "img/front/smarts_bg.png",
                socks: "img/front/socks.png",
                uniformHighlights: "img/front/uniform_highlights.png",
                uniformShadows: "img/front/uniform_shadows.png",
                uniform: "img/front/uniform.png"
            },
            extras: {
                texts: [],
                logos: [{image: 'logos/adidas.png', position: focus.logo.transform}]
            }
        };
    };

    this.getBack = function(){
        return {
            name: 'back',
            position: {
                x: constants.container.wHalf*6 ,
                y: constants.container.hHalf
            },
            layers: {
                base: "img/back/base.png",
                smarts: "img/back/smarts_bg.png",
                socks: "img/back/socks.png",
                uniformHighlights: "img/back/uniform_highlights.png",
                uniformShadows: "img/back/uniform_shadows.png",
                uniform: "img/back/uniform.png"
            },
            extras: {
                texts: [
                    {value: 'ABDULLAH', position: {x: 400, y: 250}, style:{ fontSize: '20px'}},
                    {value: '9', position: {x: 400, y: 320}, style:{ fontSize: '100px'}}
                ],
                textColor: '#338',
                logos: []
            }
        };
    }
};

