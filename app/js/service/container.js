'use strict';

var constants = require('../util/constants.js');
var focus = require('../util/focus');

module.exports = function ($http) {

    this.getFront = function (model) {
        return {
            name: 'front',
            position: {
                x: constants.container.wHalf,
                y: constants.container.hHalf
            },
            layers: {
                base: "img/" + model + "/front/base.png",
                smarts: "img/" + model + "/front/smarts_bg.png",
                socks: "img/" + model + "/front/socks.png",
                uniformHighlights: "img/" + model + "/front/uniform_highlights.png",
                uniformShadows: "img/" + model + "/front/uniform_shadows.png",
                uniform: "img/" + model + "/front/uniform.png"
            },
            extras: {
                texts: [],
                logos: [{image: 'logos/adidas.png', position: focus.logo.transform}]
            }
        };
    };

    this.getBack = function (model) {

        return {
            name: 'back',
            position: {
                x: constants.container.wHalf * 6,
                y: constants.container.hHalf
            },
            layers: {
                base: "img/" + model + "/back/base.png",
                smarts: "img/" + model + "/back/smarts_bg.png",
                socks: "img/" + model + "/back/socks.png",
                uniformHighlights: "img/" + model + "/back/uniform_highlights.png",
                uniformShadows: "img/" + model + "/back/uniform_shadows.png",
                uniform: "img/" + model + "/back/uniform.png"
            },
            extras: {
                texts: [
                    {value: 'ABDULLAH', position: {x: 400, y: 250}, style: {fontSize: '20px'}},
                    {value: '9', position: {x: 400, y: 320}, style: {fontSize: '100px'}}
                ],
                textColor: '#338',
                logos: []
            }
        };
    }
};
