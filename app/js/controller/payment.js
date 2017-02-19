module.exports = function($scope, $rootScope, $stateParams, uuidService, uniformService, gkUniformService, collarService, uniformTypesService, cacheService){

    $scope.players = [];

    $scope.sp = $stateParams;

    $scope.selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    $scope.selectedCollar = collarService.get($stateParams.collar);//
    $scope.selectedUniformType = uniformTypesService.get($scope.selectedUniform.content.type);
    $scope.paymentUuid = $stateParams.paymentUuid;
    $scope.summaryUuid=  uuidService.generate();
    $scope.gkUniforms = [];
    $scope.opts = {activeGkUniform: 0, startCount: undefined};
    $scope.numberOfPlayersArr = [];

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
          number: 0,
          size: 'M',
          goalkeeper: false,
          goalkeeperSocks: false
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

    if(cache){
        $scope.players = cache.players;
        $scope.opts.startCount = cache.players.length;
    }

    $scope.onSlideChanged = function(player, next){
        player.gkUniform = $scope.gkUniforms[next.slide.index];
    };



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

};