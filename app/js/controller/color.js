var constants = require('../util/constants');
var textureUtil = require('../util/textures');
var focus = require('../util/focus');

var sizes = constants.sizes;
var absScale = constants.absScale;
var containerSize = constants.container;


module.exports = function ($q, $scope, $timeout, $rootScope, $stateParams, $state, cacheService, colorService, collarTypesService, uniformService, shortService, uniformTypesService, collarService, uuidService, logoService, $sce) {

    var front, back;
    var running = true;
    var contentKeys = [];
    var models_tshirt = [], models_short = [], socks = [], smarts_tshirt = [], smarts_short = [];
    var backTexts = [];
    var logo1 = [], logo2 = [];
    var chestLogos = [];
    var chestTexts = [];
    var renderer, stage;
    var emptyImage = {
        url: '',
        dimensions: {
            width: 10,
            height: 10
        }
    };

    $scope.logoIndex = -1;
    $scope.files = {
        logo: undefined,
        chestLogo: undefined
    };

    $scope.next = function () {
        $scope.opts.didClickNext = true;

        var hasError = Object.keys($scope.content).find(function (key) {
            return $scope.content[key].errorCond();
        });

        if (!hasError)
            $state.transitionTo('payment', {
                collar: $scope.sp.collar,
                uniform: $scope.sp.uniform,
                colorUuid: $scope.sp.colorUuid,
                paymentUuid: $scope.paymentUuid
            });

    };


    $scope.opts = {activeShort: undefined, didClickNext: false};

    var logoPromise = logoService.getAll().then(function (response) {
        $scope.logos = response.data;
    });

    $scope.sp = $stateParams;
    $scope.colorUuid = $stateParams.colorUuid;
    $scope.paymentUuid = uuidService.generate();
    var cache = cacheService.get($scope.colorUuid);

    $scope.unSelectLogoFromLibrary = function () {
        $scope.logoIndex = -1;

        var clogo = $scope.content.logo;
        var movable = clogo.movables[0];
        movable.enabled = false;
        movable.data = '';
        movable.type = 'url';
        logo1[0].renderable = false;
    };

    $scope.selectLogoFromLibrary = function (index) {
        $scope.logoIndex = index;
        var logo = $scope.logos[index];

        var clogo = $scope.content.logo;
        var movable = clogo.movables[0];

        movable.enabled = true;
        movable.data = logo.url;
        movable.type = 'url';
        var logoLayer = logo1[0];
        logoLayer.renderable = true;
        logoLayer.texture = new PIXI.Texture.fromImage(logo.url);

        var scale = clogo.size / Math.max(logo.dimensions.width, logo.dimensions.height);
        logoLayer.scale.x = logoLayer.scale.y = scale;
    };

    $scope.unselectLogo = function () {
        var clogo = $scope.content.logo;
        var movable = clogo.movables[1];

        movable.enabled = false;
        movable.data = '';
        movable.type = 'blob';
        var logoLayer = logo2[0];
        logoLayer.renderable = false;
    };

    $scope.selectLogo = function (blob) {
        var clogo = $scope.content.logo;
        var movable = clogo.movables[1];

        movable.enabled = true;
        movable.data = blob;

        var urlCreator = window.URL || window.webkitURL;
        var logoUrl = urlCreator.createObjectURL(blob);
        var logoTexture = new PIXI.Texture.fromImage(logoUrl);
        var logoLayer = logo2[0];
        logoLayer.renderable = true;

        var img = new Image();
        img.onload = function () {
            var scale = clogo.size / Math.max(img.width, img.height);
            logoLayer.scale.x = logoLayer.scale.y = scale;
        };
        img.src = logoUrl;

        logoLayer.texture = logoTexture;
    };

     $scope.selectChestLogo = function (blob) {
        var cchestLogo = $scope.content.chestLogo;
        var movable = cchestLogo.movables[0];
        var logoLayer = chestLogos[0];

        var urlCreator = window.URL || window.webkitURL;
        var logoUrl = urlCreator.createObjectURL(blob);
        var logoTexture = new PIXI.Texture.fromImage(logoUrl);

        logoLayer.texture = logoTexture;
        movable.data = blob;

        var img = new Image();
        img.onload = function () {
            var scale = cchestLogo.size / Math.max(img.width, img.height);
            logoLayer.scale.x = logoLayer.scale.y = scale;
        };
        img.src = logoUrl;
    };

    $scope.unselectChestLogo = function () {
        var cchestLogo = $scope.content.chestLogo;
        var movable = cchestLogo.movables[0];

        var logoLayer = chestLogos[0];
        logoLayer.texture = new PIXI.Texture.fromImage('');

        movable.data = '';
    };

    var selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    var selectedCollar = collarService.get($stateParams.collar);//
    var selectedUniformType = uniformTypesService.get(selectedUniform.content.type);


    var shortPromise = shortService.getAll().then(function (response) {
        $scope.shorts = response.data.filter(function (short) {
            return short.content.type == selectedCollar.uid;
        }).map(function (s, i) {
            s.id = i;
            return s;
        });

        $scope.currentShort = null;

    });

    $scope.logoPosition = {x: 0, y: 0};

    $scope.accordion = {index: 'general'};
    $scope.faces = constants.faces;
    $scope.face = $scope.faces.FRONT;

    function createContentTemplate() {
        return {
            general: {
                title: 'Ana Renk Seçimi',
                focus: focus.body,
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                colors: [
                    {value: colorService.get('beyaz'), layers: smarts_tshirt}
                ]
            },
            tshirt: {
                title: 'TShirt Rengi',
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                focus: focus.tshirt,
                colors: [
                    {value: colorService.get('lacivert'), layers: models_tshirt}
                ]
            },
            short: {
                title: 'Şort Modeli',
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                focus: focus.shorts,
                colors: []
            },
            shortBg: {
                title: 'Şort Rengi',
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                focus: focus.shorts,
                colors: [
                    {value: colorService.get('beyaz'), layers: smarts_short}
                ]
            },
            shortFg: {
                title: 'Şort Deseni',
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                focus: focus.shorts,
                colors: [
                    {value: colorService.get('lacivert'), layers: models_short}
                ]
            },
            socks: {
                title: 'Çoraplar',
                seen: false,
                errorCond: function () {
                    return false;
                },
                focus: focus.socks,
                enabled: false,
                colors: [
                    {value: colorService.get('beyaz'), layers: socks}
                ]
            },
            logo: {
                title: 'Göğüs Logosu',
                seen: false,
                enabled: false,
                errorCond: function () {
                    return this.enabled && !(this.movables[0].enabled ||  this.movables[1].enabled);
                },
                focus: focus.logo,
                movables: [
                    {
                        layers: logo1,
                        type: 'url',
                        enabled: false,
                        data: '',
                        position: {x: 1750, y: 1250}
                    }, {
                        layers: logo2,
                        enabled: false,
                        type: 'blob',
                        data: '',
                        position: {x: 2250, y: 1250}
                    }
                ],
                size: 30,
                colors: []
            },
            chestLogo: {
                title: 'Sponsor Logosu',
                seen: false,
                enabled: false,
                errorCond: function () {
                    if(!this.enabled)
                        return false;

                    var text = this.texts[0];
                    var movable = this.movables[0];

                    if(text.enabled)
                        return text.value == 'SPONSOR' || text.value.trim() == '';

                    if(movable.enabled)
                        return movable.data == '';

                    return true;
                },
                focus: focus.sponsor,
                static: true,
                type: 'text',
                movables: [{
                    position: {x: focus.logo.transform.x, y: 1800},
                    layers: chestLogos,
                    enabled: false,
                    type: 'blob',
                    data: '',
                }],
                size: 100,
                fontFamily: 'Arial',
                texts: [
                    {
                        layers: chestTexts,
                        enabled: true,
                        value: 'SPONSOR',
                        position: {x: 400, y: 360},
                        style: {fontSize: '25px'}
                    },
                ],
                colors: []
            },
            number: {
                title: 'Forma Arkası - İsim ve Numara Rengi',
                focus: focus.backNumber,
                seen: false,
                errorCond: function () {
                    return !this.seen;
                },
                colors: [
                    {value: colorService.get('beyaz'), layers: backTexts}
                ]
            }
        };
    }

    function initVars() {
        if (cache) {
            logo1 = cache.logo1;
            logo2 = cache.logo2;
            chestLogos = cache.chestLogos;
            $scope.content = cache.content;
            var template = createContentTemplate();


            Object.keys($scope.content).map(function (key) {
                var d = $scope.content[key];
                var tpl = template[key];

                if (d.colors && d.colors.length)
                    d.colors.forEach(function (c, i) {
                        c.layers = tpl.colors[i].layers;
                    });

                if (d.movables && d.movables.length)
                    d.movables.forEach(function (m, i) {
                        m.layers = tpl.movables[i].layers;
                    });

                if (d.texts && d.texts.length)
                    d.texts.forEach(function (t, i) {
                        t.layers = tpl.texts[i].layers;
                    });
            })

        } else {
            $scope.content = createContentTemplate();
        }

        contentKeys = Object.keys($scope.content);

        //Change Texture
        //smarts_body.texture = PIXI.Texture.fromImage('img2/smarts_body_'+newValue+'.png');


        $scope.changeTint = function (layers, newColor) {
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.tint = toNumber(newColor.hex);
            });
        };

        $scope.changeText = function (layers, newText) {
            var fontSize = newText.length < 10 ? 25 : 25 * 10 / newText.length;
            layers && layers.forEach(function (layer) {
                if (layer) {
                    layer.text = newText;
                    layer.style.fontSize = fontSize + 'px';
                }
            });
        };

        $scope.changeInteraction = function (layers, isInteractive) {
            layers && layers.forEach(function (layer) {
                if (layer)
                    layer.interactive = isInteractive
            });
        };

        $scope.changeFont = function (texts, fontFamily) {
            texts && texts.forEach(function (text) {
                if (text.layers.length) {
                    text.layers[0].style.fontFamily = fontFamily;
                    text.fontFamily = fontFamily;
                }
            });
        };

        $scope.changeSockStatus = function () {
            var socks = $scope.content.socks;
            var enabled = socks.enabled;
            if (enabled) {
                $scope.changeTint(socks.colors[0].layers, socks.colors[0].value)
            } else {
                $scope.changeTint(socks.colors[0].layers, colorService.get('beyaz'))
            }
        };

        $scope.changeLogoStatus = function (section) {

            section.movables.concat(section.texts ? section.texts : []).forEach(function (m) {
                if (section.enabled && m.enabled) {
                    m.layers[0].renderable = true;
                } else {
                    m.layers[0].renderable = false;
                }
            })

        }
    }

    function initWatchers() {

        $scope.$watch('face', function (newValue) {

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

        var accordionIndex = function () {
            var sag = $scope.accordion.groups;
            return sag.indexOf(sag.find(function (g) {
                return g.isOpen
            }));
        };

        $scope.$watchCollection(accordionIndex, function (index, oldIndex) {
            var sc = $scope.content;

            if (typeof index == 'undefined' || index == -1)
                return;

            var content = sc[Object.keys(sc)[index]];
            content.seen = true;
            $scope.opts.didClickNext = false;
            var oldContent = sc[Object.keys(sc)[oldIndex]];

            if (content.movables && !content.static)
                content.movables.forEach(function (movable) {
                    $scope.changeInteraction(movable.layers, true);
                });
            else if (oldContent && oldContent.movables)
                oldContent.movables.forEach(function (movable) {
                    $scope.changeInteraction(movable.layers, false);
                });

            var _focus = content.focus;

            tweenTo(_focus);
        }, true);


        $scope.$watch('content.chestLogo.type', function(type){
            var cchestLogo = $scope.content.chestLogo;
            var movable = cchestLogo.movables[0];
            var text = cchestLogo.texts[0];
            var logoLayer = chestLogos[0];

            if(!cchestLogo.enabled)
                return;

            if(type == 'blob'){
                movable.enabled = true;
                logoLayer.renderable = true;

                text.enabled = false;
                chestTexts[0].renderable = false;
            }else if(type == 'text'){
                movable.enabled = false;
                logoLayer.renderable = false;

                text.enabled = true;
                chestTexts[0].renderable = true;
            }
        });

    }


    function toNumber(value) {
        return parseInt(value.substring(1), 16)
    }

    function tweenTo(part, duration) {
        if (typeof duration == 'undefined')
            duration = 1000;

        if (part.face)
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
        renderer = PIXI.autoDetectRenderer(containerSize.width, containerSize.height, {
            antialias: false,
            transparent: true,
            resolution: 1
        });

        document.querySelector("#pixi-scene").appendChild(renderer.view);

        // create the root of the scene graph
        stage = new PIXI.Container();
    }

    function prepareVars() {
        angular.forEach($scope.content, function (parts) {
            parts.colors && parts.colors.forEach(function (color) {
                $scope.changeTint(color.layers, color.value);
            });
            parts.texts && parts.texts.forEach(function (text) {
                $scope.changeText(text.layers, text.value);
            });
            parts.movables && parts.movables.forEach(function (movable) {
                $scope.changeInteraction(movable.layers, !parts.static);
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

        if (options.name == 'back') {
            var backTexture = PIXI.Texture.fromImage($scope.getUrl(selectedUniform, 'back_text'));
            var _backText = new PIXI.Sprite(backTexture);
            backTexts.push(_backText)
            container.addChild(_backText);
        } else {
            [$scope.content.logo, $scope.content.chestLogo].forEach(function (section) {

                var callback = function () {
                    $scope.$apply();
                };
                if (section.movable == false) {
                    callback = false;
                }

                section.movables.forEach(function (m) {
                    var logoLayer = textureUtil.createLogo(emptyImage, m.position, section.size, callback);
                    logoLayer.renderable = section.enabled;
                    m.layers.push(logoLayer);
                    container.addChild(logoLayer);
                });
            });

            var section = $scope.content.chestLogo;
            section.texts.forEach(function (text, i) {
                text.style.fontFamily = section.fontFamily;
                var textLayer = textureUtil.createText(text);
                textLayer.renderable = text.enabled && section.enabled;
                text.layers = [textLayer];
                chestTexts.push(textLayer);

                container.addChild(textLayer);
            });
        }

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

    var collarTypePromise = collarTypesService.getAll().then(function (response) {
        console.log('collar types resolved');
        initVars();
        initScene();

    }).catch(function (e) {
        console.error(e);
    });

    $q.all([shortPromise, collarTypePromise, logoPromise]).then(function () {

        var frontOptions = collarTypesService.getFront(selectedUniformType);
        var backOptions = collarTypesService.getBack(selectedUniformType);
        front = initContainer(frontOptions);
        back = initContainer(backOptions);

        prepareVars();
        initWatchers();

        requestAnimationFrame(animate);
        tweenTo(focus.infinity, 0);

        $scope.$watch('opts.activeShort', function (newIndex) {
            if (typeof newIndex != 'undefined') {
                $scope.currentShort = $scope.shorts[newIndex];
                if (models_short.length > 1) {
                    models_short[0].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_front'));
                    models_short[1].texture = new PIXI.Texture.fromImage($rootScope.getUrl($scope.currentShort, 'short_back'));
                }
            }
        });
        $scope.opts.activeShort = 0;
    });

    $scope.$on('$stateChangeStart', function () {
        cacheService.set($scope.colorUuid, {
            content: Object.keys($scope.content).reduce(function (p, key) {
                var d = $scope.content[key];
                if (d.colors && d.colors.length)
                    d.colors.forEach(function (c) {
                        c.layers = [];
                    });

                if (d.movables && d.movables.length)
                    d.movables.forEach(function (m) {
                        m.layers = [];
                    });

                if (d.texts && d.texts.length)
                    d.texts.forEach(function (t) {
                        t.layers = [];
                    });

                p[key] = d;
                return p;
            }, {}),
            logo1: logo1,
            logo2: logo2,
            chestLogos: chestLogos,
            currentShort: $scope.currentShort
        });
        running = false;
    });



    $scope.hasError = function (contentIndex) {

        for (var errorIndex = 0; errorIndex < contentKeys.length; errorIndex++) {
            if($scope.content[contentKeys[errorIndex]].errorCond()){
                break;
            }
        }

        var index = contentKeys.indexOf(contentIndex);
        return index == errorIndex && $scope.opts.didClickNext;
    };


    /*setTimeout(function () {
     tweenTo(focus.body)
     }, 4000);*/
};