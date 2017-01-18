var PIXI = require('pixi.js');
var absScale = require('./constants').absScale;

module.exports = {
    createLogo: function (logo, position, onChange) {
        var limits = [
            {x:404, y:232},
            {x:452, y:204},
            {x:486, y:226},
            {x:470, y:277}
        ];

        limits = limits.concat(limits.reduceRight(function(p, c){
            p.push({x: 800 - c.x, y: c.y});
            return p;
        }, []));

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

        function isPointInPath(x, y) {
            var j = limits.length - 1;
            var c = false;

            for(var i = 0; i < limits.length; i++){
                if ((limits[i].y < y && limits[j].y >= y ||
                    limits[j].y < y && limits[i].y >= y)) {
                    if ( limits[i].x + (y - limits[i].y) / (limits[j].y - limits[i].y) * (limits[j].x - limits[i].x) < x ){
                        c = !c;
                    }
                }
                j = i;
            }

            return c;
        }

        function closestPoint(point){
            var j = limits.length - 1;
            var c = false;
            var minPoint = point, proj;
            var min = Infinity;

            for(var i = 0; i < limits.length; i++){
                proj = project(point, limits[j], limits[i]);

                if(min > proj.dist){
                    minPoint = proj.point;
                    min = proj.dist;
                }

                j = i;
            }

            return minPoint;
        }

        function project( p, a, b ) {

            var atob = { x: b.x - a.x, y: b.y - a.y };
            var atop = { x: p.x - a.x, y: p.y - a.y };
            var len = atob.x * atob.x + atob.y * atob.y;
            var dot = atop.x * atob.x + atop.y * atob.y;
            var t = Math.min( 1, Math.max( 0, dot / len ) );
            var dist = Math.min(
                (a.x - p.x)*(a.x - p.x) + (a.y - p.y)*(a.y - p.y),
                (b.x - p.x)*(b.x - p.x) + (b.y - p.y)*(b.y - p.y)
            );

            dot = ( b.x - a.x ) * ( p.y - a.y ) - ( b.y - a.y ) * ( p.x - a.x );

            return {
                point: {
                    x: a.x + atob.x * t,
                    y: a.y + atob.y * t
                },
                dot: dot,
                dist: dist
            };
        }

        function onDragMove() {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                if(!isPointInPath(newPosition.x, newPosition.y)){
                    newPosition = closestPoint(newPosition);
                }

                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
                position.x = newPosition.x;
                position.y = newPosition.y;
                onChange();
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