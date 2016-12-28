var PIXI = require('pixi.js');
var TWEEN = require('tween.js');

var constants = require('../util/constants');
var textureUtil = require('../util/textures');
var focus = require('../util/focus');

var sizes = constants.sizes;
var absScale = constants.absScale;
var containerSize = constants.container;

var front, back;
var smarts_body = [], smarts_shorts = [], socks = [], smarts_parts = [];
var backTexts = [];
var logos = [];
var renderer, stage;


module.exports = function ($scope, $stateParams, containerService, uniformService, collarService) {

    var selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    var selectedCollar = collarService.get($stateParams.collar);//

    $scope.accordion = {index: 0};
    $scope.faces = constants.faces;
    $scope.face = $scope.faces.FRONT;

    $scope.$watch('face', function(newValue){

        var x = newValue == $scope.faces.FRONT ? 0 : -containerService.getBack().position.x + containerSize.wHalf;
        new TWEEN
            .Tween({x: stage.position.x})
            .to({x: x}, 2000)
            .onUpdate(function () {
                stage.position.x = this.x;
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    });

    function initVars() {

        $scope.content = [
            {
                title: 'Genel Görünüm',
                focus: focus.body,
                colors: []
            }, {
                title: 'TShirt',
                focus: focus.tshirt,
                colors: [
                    {value: '#3B1F4E', layers: smarts_body},
                    {value: '#FFFFFF', layers: smarts_parts}
                ]
            }, {
                title: 'Şort',
                focus: focus.shorts,
                colors: [
                    {value: '#3B1F4E', layers: smarts_shorts},
                    /*{value: '#FFFFFF', layers: []}*/
                ]
            }, {
                title: 'Çoraplar',
                focus: focus.socks,
                colors: [
                    {value: '#FFFFFF', layers: socks}
                ]
            },
            {
                title: 'Logo',
                focus: focus.logo,
                movables: [{value: function(){return $scope.accordion.index == 4}, layers: logos}],
                colors: []
            },
            {
                title: 'Numara',
                focus: focus.backNumber,
                texts: [
                ],
                colors: [
                ]
            }
        ];




        $scope.$watch('accordion.index', function (newValue, oldValue) {
            var oldContent = $scope.content[oldValue];
            var content = $scope.content[newValue];

            if(content.movables)
                content.movables.forEach(function (movable) {
                    $scope.changeInteraction(movable.layers, true);
                });
            else if(oldContent && oldContent.movables)
                oldContent.movables.forEach(function (movable) {
                    $scope.changeInteraction(movable.layers, false);
                });

            var _focus = content.focus;

            tweenTo(_focus);
        });

        //Change Texture
        //smarts_body.texture = PIXI.Texture.fromImage('img2/smarts_body_'+newValue+'.png');


        $scope.changeTint = function (layers, newColor) {
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.tint = toNumber(newColor);
            });
        };

        $scope.changeText = function (layers, newText) {
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.text = newText;
            });
        };

        $scope.changeInteraction = function(layers, isInteractive){
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.interactive = isInteractive
            });
        };
    }


    function toNumber(value) {
        return parseInt(value.substring(1), 16)
    }

    function tweenTo(part, duration) {
        if (typeof duration == 'undefined')
            duration = 1000;

        if(part.face)
            $scope.face = part.face;

        var cons = absScale * part.scale;

        var transform = {
            x: sizes.wHalf * absScale + (sizes.wHalf - part.transform.x) * cons,
            y: sizes.hHalf * absScale + (sizes.hHalf - part.transform.y) * cons
        };

        var scale = {x: part.scale, y: part.scale};

        var tweenTrans = new TWEEN
            .Tween({x: front.position.x, y: front.position.y})
            .to(transform, duration)
            .onUpdate(function () {
                back.position.x = front.position.x = this.x;
                back.position.y = front.position.y = this.y;
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();


        var tweenScale = new TWEEN
            .Tween({x: front.scale.x, y: front.scale.y})
            .to(scale, duration)
            .onUpdate(function () {
                back.scale.x = front.scale.x = this.x;
                back.scale.y = front.scale.y = this.y;
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .start();
    }



    function initScene() {
        renderer = PIXI.autoDetectRenderer(containerSize.width, containerSize.height);
        renderer.backgroundColor = 0xFFFFFF;
        document.querySelector("#pixi-scene").appendChild(renderer.view);

        // create the root of the scene graph
        stage = new PIXI.Container();
    }

    function prepareVars(){
        $scope.content.forEach(function (parts) {
            parts.colors && parts.colors.forEach(function (color) {
                $scope.changeTint(color.layers, color.value);
            });
            parts.texts && parts.texts.forEach(function (text) {
                $scope.changeText(text.layers, text.value);
            });
            parts.movables && parts.movables.forEach(function (movable) {
                $scope.changeInteraction(movable.layers, movable.value());
            });
        });
    }


    function initContainer(options) {

        var mainContainer = new PIXI.Container();
        mainContainer.position.x = options.position.x - containerSize.wHalf;
        mainContainer.position.y = options.position.y - containerSize.hHalf;


        var container = new PIXI.Container();
        container.pivot.x = containerSize.wHalf;
        container.pivot.y = containerSize.hHalf;
        container.position.x = containerSize.wHalf;
        container.position.y = containerSize.hHalf;

        mainContainer.addChild(container);
        stage.addChild(mainContainer);

        // create a new background sprite
        var base = new PIXI.Sprite.fromImage(options.layers.base);
        var _smarts_parts = new PIXI.Sprite.fromImage(options.layers.smarts);
        smarts_parts.push(_smarts_parts);

        var bodyTexture = PIXI.Texture.fromImage('models/' + selectedCollar.src +  '/tshirt/' + selectedUniform.name + '/' + options.name + '.png');
        var shortsTexture = PIXI.Texture.fromImage('models/'+ selectedCollar.src + '/shorts/' + 1 +  '/' + options.name + '.png');

        var _smarts_body = new PIXI.Sprite(bodyTexture);
        smarts_body.push(_smarts_body);

        var _smarts_shorts = new PIXI.Sprite(shortsTexture);
        smarts_shorts.push(_smarts_shorts);

        var _socks = new PIXI.Sprite.fromImage(options.layers.socks);
        socks.push(_socks);

        var uniform_highlights = new PIXI.Sprite.fromImage(options.layers.uniformHighlights);
        uniform_highlights.blendMode = PIXI.BLEND_MODES.SCREEN;

        var uniform_shadows = new PIXI.Sprite.fromImage(options.layers.uniformShadows);
        uniform_shadows.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        var uniform = new PIXI.Sprite.fromImage(options.layers.uniform);
        container.addChild(base);

        container.addChild(_smarts_parts);
        container.addChild(_smarts_body);
        container.addChild(_smarts_shorts);
        container.addChild(_socks);

        if (options.extras && options.extras.texts.length) {
            var index = 5;
            var content = $scope.content[index];
            var color = options.extras.textColor || '#333';
            var layers = [];

            options.extras.texts.forEach(function (text) {
                var textLayer = textureUtil.createText(text);

                content.texts.push({value: text.value, layers: [textLayer]});
                layers.push(textLayer);

                container.addChild(textLayer);
            });

            content.colors.push({value: color, layers: layers});
        }

        container.addChild(uniform_shadows);
        container.addChild(uniform_highlights);
        container.addChild(uniform);

        $scope.testData = {x: 0, y: 0};

        options.extras && options.extras.logos.forEach(function (logo) {
            var logoLayer = textureUtil.createLogo(logo, $scope.testData);
            logos.push(logoLayer);
            container.addChild(logoLayer);
        });


        return container;
    }

    function animate() {
        TWEEN.update();
        // time to render the stage !
        renderer.render(stage);

        // request another animation frame...
        requestAnimationFrame(animate);
    }

    initVars();

    initScene();
    front = initContainer(containerService.getFront(selectedCollar.name));
    back = initContainer(containerService.getBack(selectedCollar.name));

    prepareVars();

    requestAnimationFrame(animate);


    tweenTo(focus.infinity, 0);
    /*setTimeout(function () {
        tweenTo(focus.body)
    }, 4000);*/
};