var PIXI = require('pixi.js');
var TWEEN = require('tween.js');
var {sizes, absScale} = require('../util/constants');
var Texture = require('../util/textures');

module.exports = function ($scope, $stateParams, containerService, focusService, uniformService) {

    var logo = 'adidas.png';
    $scope.logoTexture = PIXI.Texture.fromImage('logos/' + logo);

    var focus = focusService.get();

    $scope.uniforms = uniformService.get();

    var uniform = $scope.uniforms[$stateParams.id];

    var bodyTexture = PIXI.Texture.fromImage('models/' + uniform.name + '/front_body.png');
    var shortsTexture = PIXI.Texture.fromImage('models/' + uniform.name + '/front_shorts.png');

    bodyTexture.onBaseTextureLoaded(function () {
        console.log(arguments);
    });


    $scope.accordion = {index: 0};

    var smarts_body, smarts_shorts, smarts_parts, socks, backNumber;

    function initVars() {

        $scope.content = [
            {
                title: 'Genel Görünüm',
                key: 'body',
                colors: []
            }, {
                title: 'TShirt',
                key: 'tshirt',
                colors: [
                    {value: '#3B1F4E', layers: [smarts_body]},
                    {value: '#FFFFFF', layers: [smarts_parts]}
                ]
            }, {
                title: 'Şort',
                key: 'shorts',
                colors: [
                    {value: '#3B1F4E', layers: [smarts_shorts]},
                    /*{value: '#FFFFFF', layers: []}*/
                ]
            }, {
                title: 'Çoraplar',
                key: 'socks',
                colors: [
                    {value: '#FFFFFF', layers: [socks]}
                ]
            },
            {
                title: 'Logo',
                key: 'logo',
                colors: []
            },
            {
                title: 'Numara',
                key: 'tshirt',
                texts: [
                    {value: '9', layers: [backNumber]}
                ],
                colors: [
                    {value: '#FFFFFF', layers: [backNumber]}
                ]
            }
        ];

        $scope.$watch('accordion.index', function (newValue, oldValue) {
            return () => {
                if (newValue == oldValue)
                    return;
                var key = $scope.content[newValue].key;
                tweenTo(focus[key]);
            }
        });

        //Change Texture
        //smarts_body.texture = PIXI.Texture.fromImage('img2/smarts_body_'+newValue+'.png');


        $scope.changeTint = function (layers, newColor) {
            layers.forEach(function (layer) {
                if (layer)
                    layer.tint = toNumber(newColor);
            });
        };

        $scope.changeText = function (layers, newText) {
            layers.forEach(function (layer) {
                if (layer)
                    layer.text = newText;
            });
        };


        $scope.content.forEach(function (parts) {
            parts.colors && parts.colors.forEach(function (color) {
                $scope.changeTint(color.layers, color.value);
            });
            parts.texts && parts.texts.forEach(function (text) {
                $scope.changeText(text.layers, text.value);
            });
        });
    }


    function toNumber(value) {
        return parseInt(value.substring(1), 16)
    }

    function tweenTo(part, duration) {
        if (typeof duration == 'undefined')
            duration = 1000;

        var cons = absScale * part.scale;

        var transform = {
            x: sizes.wHalf * absScale + (sizes.wHalf - part.transform.x) * cons,
            y: sizes.hHalf * absScale + (sizes.hHalf - part.transform.y) * cons
        };
        //transform = {x: 200, y: 577};
        var scale = {x: part.scale, y: part.scale};

        var tweenTrans = new TWEEN
            .Tween(front.position)
            .to(transform, duration)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();

        var tweenScale = new TWEEN
            .Tween(front.scale)
            .to(scale, duration)
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    }

    var front;
    var back;

    var renderer, stage;

    function initScene() {
        renderer = PIXI.autoDetectRenderer(800, 1153);
        renderer.backgroundColor = 0xFFFFFF;
        document.querySelector("#pixi-scene").appendChild(renderer.view);

        // create the root of the scene graph
        stage = new PIXI.Container();
    }

    function initContainer(options) {

        var container = new PIXI.Container();
        container.pivot.x = options.position.x;
        container.pivot.y = options.position.y;
        container.position.x = options.position.x;
        container.position.y = options.position.y;
        stage.addChild(container);

        // create a new background sprite
        var base = new PIXI.Sprite.fromImage(options.layers.base);
        smarts_parts = new PIXI.Sprite.fromImage(options.layers.smarts);


        smarts_body = new PIXI.Sprite(bodyTexture);
        smarts_shorts = new PIXI.Sprite(shortsTexture);
        socks = new PIXI.Sprite.fromImage(options.layers.socks);

        var uniform_highlights = new PIXI.Sprite.fromImage(options.layers.uniformHighlights);
        uniform_highlights.blendMode = PIXI.BLEND_MODES.SCREEN;

        var uniform_shadows = new PIXI.Sprite.fromImage(options.layers.uniformShadows);
        uniform_shadows.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        var uniform = new PIXI.Sprite.fromImage(options.layers.uniform);
        container.addChild(base);

        container.addChild(smarts_parts);
        container.addChild(smarts_body);
        container.addChild(smarts_shorts);
        container.addChild(socks);

        options.extras && options.extras.texts.forEach(function (text) {
            var textLayer = createText(text);
            container.addChild(textLayer);
        });


        container.addChild(uniform_shadows);
        container.addChild(uniform_highlights);
        container.addChild(uniform);

        options.extras && options.extras.logos.forEach(function (logo) {
            var logoLayer = createLogo(logo);
            container.addChild(logoLayer);
        });


        return container;
    }

    function createText(text) {
        var style = {
            fontFamily: 'Arial',
            fontSize: '70px',
            fontWeight: 'bold',
            fill: '#F7EDCA',
            align: 'center'
        };

        var textLayer = new PIXI.Text(text.value, style);
        textLayer.x = text.position.x;
        textLayer.y = text.position.y;
        return textLayer;
    }

    function createLogo(logo) {
        var logoTexture = new PIXI.Texture.fromImage(logo.image);
        var logoLayer = new PIXI.Sprite(logoTexture);
        logoLayer.interactive = true;
        logoLayer.buttonMode = true;
        logoLayer.x = logo.position.x * absScale;
        logoLayer.y = logo.position.y * absScale;
        logoLayer.scale.x = logoLayer.scale.y = 0.2;
        logoLayer.alpha = 0.8;
        logoLayer.anchor.set(0.5);

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
            }
        }

        return logoLayer;
    }

    function animate() {
        TWEEN.update();
        // time to render the stage !
        renderer.render(stage);

        // request another animation frame...
        requestAnimationFrame(animate);
    }

    initScene();
    front = initContainer(containerService.getFront());
    front.alpha = 0.2;
    back = initContainer(containerService.getBack());
    back.alpha = 0.3;

    requestAnimationFrame(animate);

    tweenTo(focus.infinity, 0);
    setTimeout(function () {
        tweenTo(focus.body)
    }, 2000);
    initVars();
};