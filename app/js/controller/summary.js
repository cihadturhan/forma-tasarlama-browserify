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


    $scope.sizeCount = $scope.getSizeCount();
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


    $scope.socksCount = function(){
        return $scope.paymentCache.players.filter(function(p){
            return p.goalkeeper ? p.goalkeeperSocks : $scope.colorCache.content.socks.enabled;
        }).length;
    };

    $scope.getTotalPrice = function(){
        return $scope.paymentCache.players.reduce(function(p, c){
            return p + $scope.getPrice(c);
        }, 0);
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

};