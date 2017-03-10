module.exports = function($uibModal, $scope, $rootScope, $stateParams, $state, uuidService, uniformService, gkUniformService, collarService, uniformTypesService, cacheService){

    $scope.sizes = ["XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"];

    $scope.openModal = function (player) {
        
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'uniformModalContent.html',
            controller: 'uniformModalCtrl',
            size: 'full',
            resolve: {
                gkUniforms: function () {
                    return $scope.gkUniforms;
                },
                selectedGlIndex: function () {
                    if(!player.gkUniform)
                        return 0;
                    return $scope.gkUniforms.indexOf(player.gkUniform);
                }
            }
        });

        modalInstance.result.then(function (gkUniform) {
            player.gkUniform = gkUniform;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.players = [];

    $scope.sp = $stateParams;

    $scope.selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    $scope.selectedCollar = collarService.get($stateParams.collar);//
    $scope.selectedUniformType = uniformTypesService.get($scope.selectedUniform.content.type);
    $scope.paymentUuid = $stateParams.paymentUuid;
    $scope.summaryUuid=  uuidService.generate();
    $scope.gkUniforms = [];
    $scope.opts = {
        activeGkUniform: 0,
        startCount: undefined,
        didClickNext: false
    };
    $scope.numberOfPlayersArr = [];
    $scope.colorCache = cacheService.get($scope.sp.colorUuid);

    if(!$scope.colorCache)
        return $state.transitionTo('color', $scope.sp);

    for (var i = +$scope.selectedUniform.content.min; i < 30; i++) {
        $scope.numberOfPlayersArr.push({
            id: i,
            index: i
        })
    }

    console.log('gkuniform started', performance.now());
    gkUniformService.getAll().then(function(response){
        console.log('gkuniform ended', performance.now());
       $scope.gkUniforms = response.data.filter(function(uniform){
           return uniform.content.type ==  $scope.selectedUniformType.uid;
       });
    });

    var cache = cacheService.get($scope.paymentUuid);

    $scope.createPlayer = function(){
      return {
          name: '',
          number: '',
          size: 'M',
          goalkeeper: false,
          goalkeeperSocks: true
      }
    };

    $scope.toggleSize = function(player){
        player.isBig = !player.isBig;
    };



    $scope.goalkeeperCount = function() {
        return $scope.players.filter(function (p) {
            return p.goalkeeper;
        }).length;
    };

    $scope.pushPlayer = function(){
        if($scope.players.length > 50)
            return;
        $scope.players.push($scope.createPlayer());
    };

    $scope.removePlayer = function(player){
        if($scope.players.length <= +$scope.selectedUniform.content.min)
            return;
        var index = $scope.players.indexOf(player);
        if(index > -1)
            $scope.players.splice(index, 1);
    };

    $scope.changeGkStatus = function(player){
        player.gkUniform = $scope.gkUniforms[player.activeGkUniform];
        if(player.goalkeeper)
            $scope.openModal(player)
    };

    if(cache){
        $scope.players = cache.players;
        $scope.opts.startCount = cache.players.length;
    }

    $scope.$watch('opts.startCount', function(newVal){
        if(newVal){
            while($scope.players.length < newVal){
                $scope.pushPlayer();
            }
        }
    });

    $scope.$on('$stateChangeStart', function(){
        cacheService.set($scope.paymentUuid, {
            players: $scope.players
        });
    });

    $scope.next = function(){
        $scope.opts.didClickNext = true;

        var hasError = $scope.players.find(function (p) {
            return !p.size || (p.goalkeeper && !p.gkUniform)
        });

        if (!hasError)
            $state.transitionTo('summary', {
                collar: $scope.sp.collar,
                uniform: $scope.sp.uniform,
                colorUuid: $scope.sp.colorUuid,
                paymentUuid: $scope.sp.paymentUuid,
                summaryUuid: $scope.summaryUuid
            });
    };


    $scope.hasError = function (player) {

        if(!$scope.opts.didClickNext)
            return false;

        var playerIndex = $scope.players.indexOf(player);
        var p;

        for (var errorIndex = 0; errorIndex < $scope.players.length; errorIndex++) {
            p = $scope.players[errorIndex];
            if(!p.size || (p.goalkeeper && !p.gkUniform)){
                break;
            }
        }

        return playerIndex == errorIndex;
    };

};