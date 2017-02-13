module.exports = function ($scope, $q, $stateParams, uuidService, collarService, uniformService, uniformTypesService) {
    $scope.collar = $stateParams.collar;
    $scope.collarObj = collarService.get($scope.collar);
    $scope.currentUniformType = uniformTypesService.getElements().find(function (uniformType) {
        return $scope.collarObj.uid == uniformType.content.type;
    });
    $scope.colorUuid = uuidService.generate();


    $scope.uniforms = [];

    var p1 = uniformService.getAll().then(function(response){
        $scope.uniforms = response.data;
        $scope.filteredUniforms = $scope.uniforms.filter(function(uniform){
            return uniform.content.type ==  $scope.currentUniformType.uid;
        });
    }).catch(function (e) {
        console.error(e);
        throw e;
    });

};