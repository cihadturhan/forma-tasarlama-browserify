module.exports = function ($scope, $stateParams, uniformService) {
    $scope.collar = $stateParams.collar;
    $scope.uniforms = [];
    uniformService.getAll().then(function(response){
        $scope.uniforms = response.data;
    });
};