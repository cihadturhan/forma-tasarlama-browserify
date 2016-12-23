module.exports = function ($scope) {
    $scope.uniforms = [
        {
            description: 'Point',
            src: 'forma'
        },
        {
            description: 'Splash',
            src: 'forma'
        },
        {
            description: 'Atlas',
            src: 'forma'
        }
    ];

    var i = 0;
    while (i++ < 10)
        $scope.uniforms.push({description: 'Model ' + i, src: 'forma'});
};