var PIXI = require('pixi.js');
var absScale = require('./constants').absScale;

module.exports = {
    createLogo: function (logo, position) {
        var logoTexture = new PIXI.Texture.fromImage(logo.image);
        var logoLayer = new PIXI.Sprite(logoTexture);
        logoLayer.interactive = false;
        logoLayer.buttonMode = true;
        logoLayer.x = logo.position.x * absScale;
        logoLayer.y = logo.position.y * absScale;
        logoLayer.scale.x = logoLayer.scale.y = 0.2;
        logoLayer.alpha = 0.8;
        logoLayer.anchor.set(0.5);

        position.x = logoLayer.x;
        position.y = logoLayer.y;

        logoLayer
        // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }

        function onDragEnd() {
            this.alpha = 0.8;

            this.dragging = false;

            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
                position.x = newPosition.x;
                position.y = newPosition.y;
            }
        }

        return logoLayer;
    },
    createText: function (text) {
        var style = {
            fontFamily: 'Arial',
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            align: 'center'
        };

        if (text.style)
            angular.extend(style, text.style);

        var textLayer = new PIXI.Text(text.value, style);
        textLayer.anchor.set(0.5, 0.5);
        textLayer.x = text.position.x;
        textLayer.y = text.position.y;
        return textLayer;
    }
};