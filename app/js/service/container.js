'use strict';

var constants = require('../util/constants.js');
var focus = require('../util/focus');

angular.module('main').service('containerService', function (colorService) {

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
            }
        };
    }
});
