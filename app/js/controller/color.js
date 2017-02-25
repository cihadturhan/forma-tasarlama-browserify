
var constants = require('../util/constants');
var textureUtil = require('../util/textures');
var focus = require('../util/focus');

var sizes = constants.sizes;
var absScale = constants.absScale;
var containerSize = constants.container;


module.exports = function ($q, $scope, $rootScope, $stateParams, cacheService, collarTypesService, uniformService, shortService, uniformTypesService, collarService, uuidService, logoService) {

    var front, back;
    var running = true;
    var smarts_body = [], smarts_shorts = [], socks = [], smarts_parts = [];
    var backTexts = [];
    var logos = [];
    var chestLogos = [];
    var renderer, stage;


    $scope.opts = {activeShort: undefined};

    logoService.getAll().then(function (response) {
        $scope.logos = response.data;
    });

    $scope.sp = $stateParams;
    $scope.colorUuid = $stateParams.colorUuid;
    $scope.paymentUuid = uuidService.generate();
    var cache = cacheService.get($scope.colorUuid);

    $scope.selectLogo = function(blob){
        var clogo = $scope.content.logo;
        clogo.enabled = true;
        clogo.data = blob;
        clogo.type = 'blob';

        var urlCreator = window.URL || window.webkitURL;
        var logoUrl = urlCreator.createObjectURL(blob);
        var logoTexture = new PIXI.Texture.fromImage(logoUrl);
        var logoLayer = logos[0];

        var img = new Image();
        img.onload = function(){
            var scale = clogo.size/Math.max(img.width, img.height);
            logoLayer.scale.x = logoLayer.scale.y = scale;
        };
        img.src = logoUrl;

        logoLayer.texture = logoTexture;
    };

    $scope.selectLogoFromLibrary = function(index){
        $scope.logoIndex = index;
        var logo = $scope.logos[index];

        var clogo = $scope.content.logo;

        clogo.enabled = true;
        clogo.data = logo.url;
        clogo.type = 'url';
        var logoLayer = logos[0];
        logoLayer.texture = new PIXI.Texture.fromImage(logo.url);

        var scale = clogo.size/Math.max(logo.dimensions.width, logo.dimensions.height);
        logoLayer.scale.x = logoLayer.scale.y = scale;
    };

    $scope.selectChestLogo = function(blob){
        var cchestLogo = $scope.content.chestLogo;
        cchestLogo.enabled = true;
        cchestLogo.data = blob;
        cchestLogo.type = 'blob';

        var urlCreator = window.URL || window.webkitURL;
        var logoUrl = urlCreator.createObjectURL(blob);
        console.log(logoUrl);
        var logoTexture = new PIXI.Texture.fromImage(logoUrl);
        var logoLayer = chestLogos[0];
        logoLayer.texture = logoTexture;

        var img = new Image();
        img.onload = function(){
            var scale = cchestLogo.size/Math.max(img.width, img.height);
            logoLayer.scale.x = logoLayer.scale.y = scale;
        };
        img.src = logoUrl;
    };

    $scope.selectChestLogoFromLibrary = function(index){
        $scope.chestLogoIndex = index;
        var logo = $scope.logos[index];

        var cchestLogo = $scope.content.chestLogo;
        cchestLogo.enabled = true;
        cchestLogo.data = logo.url;
        cchestLogo.type = 'url';
        var logoLayer = chestLogos[0];
        logoLayer.texture = new PIXI.Texture.fromImage(logo.url);

        var scale = cchestLogo.size/Math.max(logo.dimensions.width, logo.dimensions.height);
        logoLayer.scale.x = logoLayer.scale.y = scale;

    };

    var selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    var selectedCollar = collarService.get($stateParams.collar);//
    var selectedUniformType = uniformTypesService.get(selectedUniform.content.type);



    var shortPromise = shortService.getAll().then(function(response){
        $scope.shorts = response.data.filter(function(short){
            return short.content.type == selectedCollar.uid;
        }).map(function(s, i){
            s.id = i;
            return s;
        });

        $scope.currentShort = null;

    });

    $scope.logoPosition = {x: 0, y: 0};

    $scope.accordion = {index: 'general'};
    $scope.faces = constants.faces;
    $scope.face = $scope.faces.FRONT;

    function initVars() {
        if (cache){
            $scope.content = cache.content;
            logos = cache.logos;
            chestLogos = cache.chestLogos;
        }else {
            $scope.content = {
                general: {
                    title: 'Ana Renk Seçimi',
                    focus: focus.body,
                    colors: [
                        {value: '#FFFFFF', layers: smarts_parts}
                    ]
                },
                tshirt: {
                    title: 'TShirt Rengi',
                    focus: focus.tshirt,
                    colors: [
                        {value: '#3B1F4E', layers: smarts_body}
                    ]
                },
                short: {
                    title: 'Şort',
                    focus: focus.shorts,
                    colors: [
                        {value: '#3B1F4E', layers: smarts_shorts}
                    ]
                },
                socks: {
                    title: 'Çoraplar',
                    focus: focus.socks,
                    enabled: false,
                    colors: [
                        {value: '#FFFFFF', layers: socks}
                    ]
                },
                logo: {
                    title: 'Göğüs Logosu',
                    focus: focus.logo,
                    enabled: false,
                    type: 'url',
                    data: '',
                    position: angular.copy(focus.logo.transform),
                    movables: [{
                        value: function () {
                            return $scope.accordion.index == 4
                        },
                        layers: logos
                    }],
                    size: 30,
                    colors: []
                },
                chestLogo: {
                    title: 'Sponsor Logosu',
                    focus: focus.tshirt,
                    enabled: false,
                    type: 'url',
                    data: '',
                    movable: false,
                    position: {x: focus.logo.transform.x, y: 1800},
                    movables: [{
                        value: function () {
                            return $scope.accordion.index == 4
                        },
                        layers: chestLogos,
                    }],
                    size: 100,
                    colors: []
                },
                number: {
                    title: 'Numara',
                    focus: focus.backNumber,
                    texts: [],
                    colors: []
                }
            };
        }

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

        $scope.changeSockStatus = function(){
            var socks = $scope.content.socks;
            var enabled = socks.enabled;
            if(enabled){
                $scope.changeTint(socks.colors[0].layers, socks.colors[0].value)
            }else{
                $scope.changeTint(socks.colors[0].layers, '#FFFFFF')
            }
        };

        $scope.changeLogoStatus = function(section){
            var logoLayer;
            var movableLayers = section.movables[0].layers;
            if(section.enabled){
                if(movableLayers.length == 0){
                    var callback = function(){ $scope.$apply();};
                    if(section.movable == false){
                        callback = false;
                    }
                    logoLayer = textureUtil.createLogo($scope.logos[0], section.position, section.size, callback);
                    movableLayers.push(logoLayer);
                    front.addChild(logoLayer);
                }else{
                    movableLayers[0].renderable = true;
                }

            }else{
                if(movableLayers.length > 0){
                    movableLayers[0].renderable = false;
                }else{

                }
            }
        }
    }

    function initWatchers(){

        $scope.$watch('face', function(newValue){

            var x = newValue == $scope.faces.FRONT ? 0 : -collarTypesService.getBack(selectedUniformType).position.x + containerSize.wHalf;
            new TWEEN
                .Tween({x: stage.position.x})
                .to({x: x}, 1000)
                .onUpdate(function () {
                    stage.position.x = this.x;
                })
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        });

        var accordionIndex = function(){
            var sag = $scope.accordion.groups;
            return sag.indexOf(sag.find(function(g){return g.isOpen}));
        };

        $scope.$watchCollection(accordionIndex, function (index, oldIndex) {
            var sc = $scope.content;

            if(typeof index == 'undefined' || index == -1)
                return;

            var content = sc[Object.keys(sc)[index]];
            var oldContent = sc[Object.keys(sc)[oldIndex]];

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
        }, true);
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
        renderer = PIXI.autoDetectRenderer(containerSize.width, containerSize.height, {antialias: false, transparent: true, resolution: 1});

        document.querySelector("#pixi-scene").appendChild(renderer.view);

        // create the root of the scene graph
        stage = new PIXI.Container();
    }

    function prepareVars(){
        angular.forEach($scope.content, function (parts) {
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

        var bodyTexture = PIXI.Texture.fromImage($scope.getUrl(selectedUniform, 'tshirt_' + options.name));
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

            var content = $scope.content.number;
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

        return container;
    }

    function animate() {
        TWEEN.update();
        // time to render the stage !
        renderer.render(stage);

        // request another animation frame...
        running && requestAnimationFrame(animate);
    }

    var collarTypePromise = collarTypesService.getAll().then(function(response){
        initVars();

        initScene();
        front = initContainer(collarTypesService.getFront(selectedUniformType));
        back = initContainer(collarTypesService.getBack(selectedUniformType));

        prepareVars();
        initWatchers();

        requestAnimationFrame(animate);


        tweenTo(focus.infinity, 0);
    }).catch(function (e) {
        console.error(e);
    });

    $q.all([shortPromise, collarTypePromise]).then(function () {
        $scope.$watch('opts.activeShort', function(newIndex){
            if(typeof newIndex != 'undefined'){
                $scope.currentShort = $scope.shorts[newIndex];
                if(smarts_shorts.length > 1){
                    smarts_shorts[0].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_front'));
                    smarts_shorts[1].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_back'));
                }
            }
        });
        $scope.opts.activeShort = 0;
    });

    $scope.$on('$stateChangeStart', function(){
        cacheService.set($scope.colorUuid, {
            content: $scope.content,
            logos: logos,
            chestLogos: chestLogos,
            currentShort: $scope.currentShort
        });
        running = false;
    });


    /*setTimeout(function () {
        tweenTo(focus.body)
    }, 4000);*/
};