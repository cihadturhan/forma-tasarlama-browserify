'use strict';

module.exports = function($http, focusService) {

    var focus = focusService.get();

    this.getFront = function() {
        return {
            position: {
                x: 400,
                y: 577
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
                texts: [{value: '9', position: {x: 380, y: 250}}],
                logos: [{image: 'logos/adidas.png', position: focus.logo.transform}]
            }
        };
    };

    this.getBack = function(){
        return {
            position: {
                x: 400,
                y: 577
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
                texts: [{value: '9', position: {x: 380, y: 250}}],
                logos: [{image: 'logos/adidas.png', position: focus.logo.transform}]
            }
        };
    }
};

