module.exports = function ($scope, $uibModalInstance, gkUniforms, selectedGlIndex) {
    console.log(gkUniforms);
    $scope.gkUniforms = gkUniforms;
    $scope.selected = {
        gkUniform: $scope.gkUniforms[selectedGlIndex]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.gkUniform);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};