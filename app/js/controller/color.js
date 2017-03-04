
var constants = require('../util/constants');
var textureUtil = require('../util/textures');
var focus = require('../util/focus');

var sizes = constants.sizes;
var absScale = constants.absScale;
var containerSize = constants.container;


module.exports = function ($q, $scope, $timeout, $rootScope, $stateParams, $state, cacheService, colorService, collarTypesService, uniformService, shortService, uniformTypesService, collarService, uuidService, logoService, $sce) {

    var front, back;
    var running = true;
    var models_tshirt = [], models_short = [], socks = [], smarts_tshirt = [], smarts_short = [];
    var backTexts = [];
    var logos = [];
    var chestLogos = [];
    var renderer, stage;

    $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> <br/> have <div class="label label-success">HTML</div> content');

    $scope.next = function(){
        $scope.opts.didClickNext = true;

        var hasError = Object.keys($scope.content).find(function(key){
            return  $scope.content[key].error;
        });

        if(!hasError)
            $state.transitionTo('payment',{collar: $scope.sp.collar, uniform: $scope.sp.uniform, colorUuid: $scope.sp.colorUuid, paymentUuid: $scope.paymentUuid});

    };


    $scope.opts = {activeShort: undefined, didClickNext: false};

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

    function createContentTemplate(){
        return {
            general: {
                title: 'Ana Renk Seçimi',
                focus: focus.body,
                error: true,
                colors: [
                    {value: colorService.get('beyaz'), layers: smarts_tshirt}
                ]
            },
            tshirt: {
                title: 'TShirt Rengi',
                error: true,
                focus: focus.tshirt,
                colors: [
                    {value: colorService.get('lacivert'), layers: models_tshirt}
                ]
            },
            short: {
                title: 'Şort Modeli',
                error: true,
                focus: focus.shorts,
                colors: []
            },
            shortBg: {
                title: 'Şort Rengi',
                error: true,
                focus: focus.shorts,
                colors: [
                    {value: colorService.get('beyaz'), layers: smarts_short}
                ]
            },
            shortFg: {
                title: 'Şort Deseni',
                error: true,
                focus: focus.shorts,
                colors: [
                    {value: colorService.get('lacivert'), layers: models_short}
                ]
            },
            socks: {
                title: 'Çoraplar',
                error: true,
                focus: focus.socks,
                enabled: false,
                colors: [
                    {value: colorService.get('beyaz'), layers: socks}
                ]
            },
            logo: {
                title: 'Göğüs Logosu',
                error: false,
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
                error: false,
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
                    layers: chestLogos
                }],
                size: 100,
                colors: []
            },
            number: {
                title: 'Forma Arkası - İsim ve Numara Rengi',
                focus: focus.backNumber,
                error: false,
                fontFamily: 'Arial',
                texts: [
                    {value: 'OYUNCU', position: {x: 400, y: 250}, style: {fontSize: '20px'}},
                    {value: '9', position: {x: 400, y: 360}, style: {fontSize: '150px'}}
                ],
                colors: [
                    {value: colorService.get('beyaz'), layers: backTexts}
                ]
            }
        };
    }

    function initVars() {
        if (cache){
            logos = cache.logos;
            chestLogos = cache.chestLogos;
            $scope.content = cache.content;
            var template = createContentTemplate();

            Object.keys($scope.content).map(function(key){
                var d = $scope.content[key];
                var tpl = template[key];

                if(d.colors && d.colors.length)
                    d.colors.forEach(function(c, i){
                        c.layers = tpl.colors[i].layers;
                    });

                if(d.movables && d.movables.length)
                    d.movables.forEach(function(m, i){
                        m.layers = tpl.movables[i].layers;
                    });

                if(d.texts && d.texts.length)
                    d.texts.forEach(function(t, i){
                        t.layers = tpl.texts[i].layers;
                    });
            })

        }else {
            $scope.content = createContentTemplate();
        }

        //Change Texture
        //smarts_body.texture = PIXI.Texture.fromImage('img2/smarts_body_'+newValue+'.png');


        $scope.changeTint = function (layers, newColor) {
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.tint = toNumber(newColor.hex);
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

        $scope.changeFont = function(texts, fontFamily){
            texts && texts.forEach(function (text) {
                if (text.layers.length){
                    text.layers[0].style.fontFamily = fontFamily;
                    text.fontFamily = fontFamily;
                }
            });
        };

        $scope.changeSockStatus = function(){
            var socks = $scope.content.socks;
            var enabled = socks.enabled;
            if(enabled){
                $scope.changeTint(socks.colors[0].layers, socks.colors[0].value)
            }else{
                $scope.changeTint(socks.colors[0].layers, colorService.get('beyaz'))
            }
        };

        $scope.changeLogoStatus = function(section){

            var movableLayers = section.movables[0].layers;
            if(section.enabled){
                movableLayers[0].renderable = true;
            }else{
                movableLayers[0].renderable = false;
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
            content.error = false;
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
        var _smarts_tshirt = new PIXI.Sprite.fromImage(options.layers.smarts);
        smarts_tshirt.push(_smarts_tshirt);

        var _smarts_short = new PIXI.Sprite.fromImage(options.layers.shorts);
        smarts_short.push(_smarts_short);

        var tshirtTexture = PIXI.Texture.fromImage($scope.getUrl(selectedUniform, 'tshirt_' + options.name));
        var shortTexture = PIXI.Texture.fromImage('');

        var _models_tshirt = new PIXI.Sprite(tshirtTexture);
        models_tshirt.push(_models_tshirt);

        var _models_short = new PIXI.Sprite(shortTexture);
        models_short.push(_models_short);

        var _socks = new PIXI.Sprite.fromImage(options.layers.socks);
        socks.push(_socks);

        var uniform_highlights = new PIXI.Sprite.fromImage(options.layers.uniformHighlights);
        uniform_highlights.blendMode = PIXI.BLEND_MODES.SCREEN;

        var uniform_shadows = new PIXI.Sprite.fromImage(options.layers.uniformShadows);
        uniform_shadows.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        var uniform = new PIXI.Sprite.fromImage(options.layers.uniform);
        container.addChild(base);

        container.addChild(_smarts_tshirt);
        container.addChild(_smarts_short);
        container.addChild(_models_tshirt);
        container.addChild(_models_short);
        container.addChild(_socks);

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

    function addFrontSpecificLayers(){
        [$scope.content.logo, $scope.content.chestLogo].forEach(function(section){

            var callback = function(){ $scope.$apply();};
            if(section.movable == false){
                callback = false;
            }

            var logoLayer = textureUtil.createLogo($scope.logos[0], section.position, section.size, callback);
            var movableLayers = section.movables[0].layers;
            logoLayer.renderable = section.enabled;
            movableLayers.push(logoLayer);
            front.addChild(logoLayer);
        })
    }

    function addBackSpecificLayers(){

        var section = $scope.content.number;

        section.texts.forEach(function (text, i) {
            text.style.fontFamily = section.fontFamily;
            var textLayer = textureUtil.createText(text);

            text.layers = [textLayer];
            backTexts.push(textLayer);

            back.addChild(textLayer);
        });
    }

    var collarTypePromise = collarTypesService.getAll().then(function(response){
        initVars();

        initScene();
        var frontOptions = collarTypesService.getFront(selectedUniformType);
        var backOptions = collarTypesService.getBack(selectedUniformType);
        front = initContainer(frontOptions);
        addFrontSpecificLayers();
        back = initContainer(backOptions);
        addBackSpecificLayers();

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
                if(models_short.length > 1){
                    models_short[0].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_front'));
                    models_short[1].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_back'));
                }
            }
        });
        $scope.opts.activeShort = 0;
    });

    $scope.$on('$stateChangeStart', function(){
        cacheService.set($scope.colorUuid, {
            content: Object.keys($scope.content).reduce(function(p, key){
                var d = angular.copy($scope.content[key]);
                if(d.colors && d.colors.length)
                    d.colors.forEach(function(c){
                        c.layers = [];
                    });

                if(d.movables && d.movables.length)
                    d.movables.forEach(function(m){
                        m.layers = [];
                    });

                if(d.texts && d.texts.length)
                    d.texts.forEach(function(t){
                        t.layers = [];
                    });

                p[key] = d;
                return p;
            }, {}),
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