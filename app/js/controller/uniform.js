module.exports = function ($scope, $stateParams, uniformService) {
    $scope.collar = $stateParams.collar;
    $scope.uniforms = uniformService.getAll();

    var i = 0;
    while (i++ < 10)
        $scope.uniforms.push({description: 'Model ' + i, src: 'forma'});
};