var host = require('../util/constants').backendHost;

module.exports = function ($q, $scope, $rootScope, $stateParams, cacheService, collarTypesService, uniformService, shortService, uniformTypesService, collarService, Upload, logoService) {

    $scope.fields = {};

    $scope.sp = $stateParams;
    $scope.selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    $scope.selectedCollar = collarService.get($stateParams.collar);//
    $scope.selectedUniformType = uniformTypesService.get($scope.selectedUniform.content.type);

    $scope.paymentUuid = $stateParams.paymentUuid;
    $scope.colorUuid = $stateParams.colorUuid;

    $scope.gkUniforms = [];
    $scope.opts = {activeGkUniform: 0, startCount: undefined};
    $scope.numberOfPlayersArr = [];

    $scope.colorCache = cacheService.get($scope.colorUuid);
    $scope.paymentCache = cacheService.get($scope.paymentUuid);

    $scope.getProducts = function(){
        var c = $scope.colorCache.content;

        var tshirts = {
            name: $scope.selectedUniform.content.title+ ' - Üst',
            quantity: $scope.playerCount(),
            color: c.general.colors[0].value + ' ' +c.tshirt.colors[0].value,
            totalPrice: $scope.playerCount() * parseInt($scope.selectedUniform.content.price)
        };

        var shorts = {
            name: $scope.colorCache.currentShort.content.title + ' - Şort',
            quantity: $scope.playerCount(),
            color: c.short.colors[0].value,
            totalPrice: $scope.playerCount() * parseInt($scope.colorCache.currentShort.content.price)
        };

        var socks = !c.socks.enabled ?
            []:
        {
            name: 'Çorap',
            quantity: $scope.playerCount(),
            color: c.socks.colors[0].value,
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
                quantity: o.count,
                color: '',
                totalPrice: o.count * parseInt(o.uniform.content.price)
            }
        });

        var products = [].concat(tshirts, shorts, socks, gkUniforms);

        var subTotal = products.reduce(function(p,c){
            return p + c.totalPrice;
        },0);

        var tax = {
            name: 'KDV Tutari %8',
            quantity: '',
            color: '',
            totalPrice: subTotal * 0.08
        };

        return products.concat(tax);
    };

    $scope.getTotalPrice = function(){
        return $scope.products
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

    $scope.sendForm = function(){
        var content = $scope.colorCache.content;

        if(content.logo.enabled && content.logo.type == 'blob'){
            $scope.fields.logoFile = content.logo.data;
        }

        if(content.chestLogo.enabled && content.chestLogo.type == 'blob'){
            $scope.fields.chestLogoFile = content.chestLogo.data;
        }

        $scope.fields.models = {
            uniform: $scope.selectedUniform.uid,
            short: $scope.colorCache.currentShort.uid
        };

        var content = $scope.colorCache.content;

        $scope.fields.colors = {
            general: content.general.colors[0].value,
            tshirt: content.tshirt.colors[0].value,
            short: content.short.colors[0].value,
            socks: content.socks.colors[0].value
        };

        $scope.fields.players = $scope.paymentCache;

        Upload.upload({
            url: host + '/siparisler',//host + '/wp-admin/admin-ajax.php',
            data: $scope.fields
        }).then(function(){
            console.log(arguments);
        }).catch(function(){
            console.error(arguments);
        });
    }

    $scope.products = $scope.getProducts();
    $scope.sizeCount = $scope.getSizeCount();

};