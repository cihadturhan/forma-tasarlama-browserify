module.exports = function($scope, $stateParams, uuidService){
    $scope.sp = $stateParams;
    $scope.paymentUuid = uuidService.generate();

};