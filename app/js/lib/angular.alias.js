var app = angular.module('main');

app.directive('ngAlias',

    function ngAlias($compile) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var args = attrs.ngAlias.split('as').map(function (elm) {
                    return elm.replace(/ /g, '')
                });

                scope[args[0]] = '';

                var dot = args[1].split('.');

                var object = {};

                dot.forEach(function (value, index) {
                    index === 0
                        ? object = scope[value]
                        : object = object[value] === null ? object[value] = {} : object[value];
                });

                console.log(object)

                scope[args[0]] = object;
            }
        };
    }
);