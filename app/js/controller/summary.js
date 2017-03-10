var host = require('../util/constants').backendHost;
var absScale = require('../util/constants').absScale;

module.exports = function ($q, $scope, $state, $rootScope, $stateParams, cacheService, collarTypesService, uniformService, shortService, uniformTypesService, collarService, Upload, logoService) {

    $scope.fields = {
        name: '',
        tel: '',
        tc: '',
        email: '',
        address: '',
        note: ''
    };

    $scope.sp = $stateParams;
    $scope.selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    $scope.selectedCollar = collarService.get($stateParams.collar);//
    $scope.selectedUniformType = uniformTypesService.get($scope.selectedUniform.content.type);

    $scope.paymentUuid = $stateParams.paymentUuid;
    $scope.colorUuid = $stateParams.colorUuid;

    $scope.gkUniforms = [];
    $scope.opts = {activeGkUniform: 0, startCount: undefined, didClickNext: false};
    $scope.numberOfPlayersArr = [];

    $scope.colorCache = cacheService.get($scope.colorUuid);
    $scope.paymentCache = cacheService.get($scope.paymentUuid);

    if(!$scope.colorCache)
        return $state.transitionTo('color', $scope.sp);

    if(!$scope.paymentCache)
        return $state.transitionTo('payment', $scope.sp);

    $scope.getProducts = function(){
        var c = $scope.colorCache.content;

        var tshirts = {
            uid: $scope.selectedUniform.uid,
            type: 'tshirt',
            name: $scope.selectedUniform.content.title+ ' - Üst',
            quantity: $scope.playerCount(),
            colors: [c.general.colors[0].value, c.tshirt.colors[0].value],
            totalPrice: $scope.playerCount() * parseInt($scope.selectedUniform.content.price)
        };

        var shorts = {
            uid: $scope.colorCache.currentShort.uid,
            type: 'shorts',
            name: $scope.colorCache.currentShort.content.title + ' - Şort',
            quantity: $scope.playerCount(),
            colors: [c.shortBg.colors[0].value, c.shortFg.colors[0].value],
            totalPrice: $scope.playerCount() * parseInt($scope.colorCache.currentShort.content.price)
        };

        var socks = !c.socks.enabled ?
            []:
        {
            name: 'Çorap',
            type: 'socks',
            uid: 'socks',
            quantity: $scope.playerCount(),
            colors: [c.socks.colors[0].value],
            totalPrice: 5 * $scope.playerCount()
        };


        var gkUniforms = $scope.paymentCache.players.filter(function (p) {
            return p.goalkeeper;
        }).map(function(p){
            return p.gkUniform;
        }).reduce(function (p, c) {
            var obj = p.find(function (o) {
                return o.uniform.uid == c.uid;
            });

            if (obj) {
                obj.count++;
            } else {
                p.push({
                    count: 1,
                    uniform: c
                });
            }
            return p;
        }, []).map(function(o){
            return {
                name: o.uniform.content.title + ' - Kaleci Forması',
                uid: o.uniform.uid,
                type: 'gkUniform',
                quantity: o.count,
                colors: [],
                totalPrice: o.count * parseInt(o.uniform.content.price)
            }
        });

        var products = [].concat(tshirts, shorts, socks, gkUniforms);

        return products;
    };

    $scope.getSubtotal = function(){
        return $scope.products.reduce(function(p,c){
            return p + c.totalPrice;
        },0);
    };

    $scope.getTax = function(){
        var subTotal = $scope.getSubtotal();

        return {
            name: 'KDV Tutari %8',
            quantity: '',
            type: 'tax',
            colors: [],
            totalPrice: subTotal * 0.08
        };
    };

    $scope.getTotalPrice = function(){
        return $scope.products
            .concat($scope.tax)
            .reduce(function (p, c) {
                return p + c.totalPrice;
            }, 0);
    };

    $scope.getSizeCount = function(){
        var sizeObj = $scope.paymentCache.players.reduce(function (p, c) {
            if(typeof p[c.size] != 'undefined')
                p[c.size]++;
            else
                p[c.size] = 1;
            return p;
        },{});

        var sizeArr = [];

        angular.forEach(sizeObj, function(d, key){
            sizeArr.push({
                count: d,
                size: key
            })
        });

        return sizeArr;
    };

    $scope.getPrice = function(player){
        var price = 0;
      if(player.goalkeeper){
          price += +player.gkUniform.content.price;
          player.goalkeeperSocks && (price += 5);
      }else{
          price += +$scope.selectedUniform.content.price;
          $scope.colorCache.content.socks.enabled && (price += 5);
      }
      return price;
    };

    $scope.goalkeeperCount = function() {
        return $scope.paymentCache.players.filter(function (p) {
            return p.goalkeeper;
        }).length;
    };

    $scope.playerCount = function() {
        return $scope.paymentCache.players.filter(function (p) {
            return !p.goalkeeper;
        }).length;
    };


    $scope.socksCount = function(){
        return $scope.paymentCache.players.filter(function(p){
            return p.goalkeeper ? p.goalkeeperSocks : $scope.colorCache.content.socks.enabled;
        }).length;
    };

    $scope.hasErrorVar = false;

    $scope.sendForm = function(){
        if($scope.inProgress)
            return;

        $scope.opts.didClickNext = true;

        $scope.hasErrorVar = $scope.requiredFields.find(function (f) {
            return !$scope.fields[f] || $scope.fields[f].trim() == '';
        });

        if($scope.hasErrorVar) {
            document.body.scrollTop = 0;
            return;
        }

        var content = $scope.colorCache.content;
        var logoUrlText = '', logoUrlCoordinate = '', logoFileText = '', logoFileCoordinate = '', chestLogoText = '', chestLogoFont = '';

        if(content.logo.enabled){
            var movables = content.logo.movables;
            var m = movables[0];
            if(m && m.enabled){
                $scope.fields.logoUrlInfo = {
                    type: m.type,
                    position: m.position
                };
                $scope.fields.logoUrl = m.data;
                logoUrlText = 'İlk Logo Resim Adresi: Resim (' + m.data + ')';
                logoUrlCoordinate = 'İlk Logo Koordinatı: (' + m.position.x/absScale + ',' + m.position.y/absScale + ')';
            }

            m = movables[1];

            if(m && m.enabled){
                $scope.fields.logoFileInfo = {
                    type: m.type,
                    position: m.position
                };
                $scope.fields.logoData = m.data;
                logoFileText = 'İkinci Logo Resim Adresi: Dosya (Sol Panelde Ekli) ';
                logoFileCoordinate = 'İkinci Logo Koordinatı: (' + m.position.x/absScale + ',' + m.position.y/absScale + ')';
            }
        }

        if(content.chestLogo.enabled){
            if(content.chestLogo.type == 'blob'){
                chestLogoText = 'Sponsor Logosu: Dosya (Sol Panelde Ekli)';
                $scope.fields.chestLogoData = content.chestLogo.movables[0].data;
            }else if(content.chestLogo.type == 'text'){
                var text = content.chestLogo.texts[0];
                chestLogoFont = 'Sponsor Fontu: ' + text.fontFamily;
                chestLogoText = 'Sponsor Logosu: Yazı (' + text.value.trim() + ')';
                $scope.fields.chestLogoData = text.value;
            }
            $scope.fields.chestLogoInfo = {
                type: content.chestLogo.type
            };
        }

        $scope.fields.models = $scope.products.reduce(function(p, c){
            if(c.type)
                p[c.type] = c.uid;

            return p;
        }, {});


        $scope.fields.colors = {
            general: content.general.colors[0].value,
            tshirt: content.tshirt.colors[0].value,
            shortBg: content.shortBg.colors[0].value,
            shortFg: content.shortFg.colors[0].value,
            socks: content.socks.colors[0].value
        };

        $scope.fields.products = $scope.getProducts();
        $scope.fields.extra = [
            logoUrlText,
            logoUrlCoordinate,
            logoFileText,
            logoFileCoordinate,
            chestLogoText,
            chestLogoFont,
            'Sırt Yazı Rengi: ' + content.number.colors[0].value.name + '(' + content.number.colors[0].value.hex + ')',

        ].join('\n');

        $scope.fields.players = $scope.paymentCache.players;
        $scope.inProgress = true;

        Upload.upload({
            url: host + '/siparisler',
            data: $scope.fields
        }).then(function(response){
            $scope.inProgress = false;

            if(response.data && response.data.status == 'success'){
                $state.transitionTo('final', { });
            }else{
                alert(response.data.data);
            }
        }).catch(function(){
            $scope.inProgress = false;
            console.error(arguments);
        });
    };

    $scope.products = $scope.getProducts();
    $scope.tax = $scope.getTax();
    $scope.sizeCount = $scope.getSizeCount();

    $scope.requiredFields = ['name', 'email', 'tel', 'address'];

    $scope.hasError = function (field) {

        if(!$scope.opts.didClickNext)
            return false;

        var playerIndex = $scope.requiredFields.indexOf(field);
        var currField;

        for (var errorIndex = 0; errorIndex < $scope.requiredFields.length; errorIndex++) {
            currField = $scope.requiredFields[errorIndex];
            if(!$scope.fields[currField] || $scope.fields[currField].trim() == ''){
                break;
            }
        }

        return playerIndex == errorIndex;
    };


};