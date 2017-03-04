//var PIXI = require('pixi.js');
var absScale = require('./constants').absScale;

module.exports = {
    createLogo: function (image, position, size, onChange) {
        var limits = [
            {x:404, y:232},
            {x:452, y:204},
            {x:486, y:226},
            {x:470, y:277}
        ];

        //var dragLayer = new PIXI.DisplayGroup(0, false);


        limits = limits.concat(limits.reduceRight(function(p, c){
            p.push({x: 800 - c.x, y: c.y});
            return p;
        }, []));

        var logoTexture = new PIXI.Texture.fromImage(image.url);
        var logoLayer = new PIXI.Sprite(logoTexture);

        logoLayer.x = position.x * absScale;
        logoLayer.y = position.y * absScale;
        var scale = size/Math.max(image.dimensions.width, image.dimensions.height);
        logoLayer.scale.x = logoLayer.scale.y = scale;
        logoLayer.alpha = 0.8;
        logoLayer.anchor.set(0.5);
        //logoLayer.displayGroup = dragLayer;

        position.x = logoLayer.x;
        position.y = logoLayer.y;


        if(onChange) {
            logoLayer.interactive = true;
            logoLayer.buttonMode = true;

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
        }

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
            var point = {
                x: a.x + atob.x * t,
                y: a.y + atob.y * t
            };
            var dist =  (point.x - p.x)*(point.x - p.x) + (point.y - p.y)*(point.y - p.y);

            return {
                point: point,
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
            fill: '#FFFFFF',
            stroke: '#0F0F0F',
            align: 'center',
            strokeThickness: Math.round(Math.log(parseInt(text.style.fontSize)))
        };

        if (text.style)
            angular.extend(style, text.style);

        var textLayer = new PIXI.Text(text.value, style);
        textLayer.anchor.set(0.5, 0.5);
        textLayer.x = text.position.x;
        textLayer.y = text.position.y;
        textLayer.alpha = 0.9;
        return textLayer;
    }
};