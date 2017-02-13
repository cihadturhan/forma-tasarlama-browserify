module.exports = function($scope, $rootScope, $stateParams, uuidService, uniformService, collarService, uniformTypesService, cacheService){

    $scope.players = [];

    $scope.sp = $stateParams;

    $scope.selectedUniform = uniformService.get($stateParams.uniform);//$scope.uniforms[$stateParams.uniform];
    $scope.selectedCollar = collarService.get($stateParams.collar);//
    $scope.selectedUniformType = uniformTypesService.get($scope.selectedUniform.content.type);
    $scope.paymentUuid = $stateParams.paymentUuid;
    $scope.summaryUuid=  uuidService.generate();

    var cache = cacheService.get($scope.paymentUuid);

    $scope.createPlayer = function(){
      return {
          name: '',
          number: 0,
          size: 'M',
          goalkeeper: false
      }
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
    }else{
        $scope.players = [];
        while($scope.players.length < +$scope.selectedUniform.content.min){
            $scope.pushPlayer();
        }
    }

    $scope.$on('$stateChangeStart', function(){
        cacheService.set($scope.paymentUuid, {
            players: $scope.players
        });
    });


};