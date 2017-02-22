var app = angular.module('main');

app.run(["$templateCache", function ($templateCache) {
    $templateCache.put("colorlist.html",
        '<div class="row" ng-repeat="colorChunk in $parent.colorChunks">'+
         '<div class="col-xs-1 color-box"  ng-repeat="color in colorChunk" ng-style="{backgroundColor: color.hex, width: 40, height: 40}" ng-click="$parent.setColor(color)"></div>'+
     '</div>');
    }
]);


app.directive('colorPicker', function (colorService, $sce) {
    return {
        restrict: "E",
        scope: {
            selectedColor: "=",
            onChange: '&'
        },
        template: '<div uib-popover-template="\'colorlist.html\'" popover-is-open="popover.isOpen" popover-trigger="\'outsideClick\'" popover-placement="left-top" ng-style="{backgroundColor: selectedColor}">&nbsp;</div>',
        link: function (scope, elem, attrs) {

            scope.$watch('popover.isOpen', function (isOpen) {
                if (isOpen) {
                    colorService.getAll().then(function (response) {
                        scope.colors = response.data;
                        scope.colorChunks = scope.colors.reduce(function (p, c, i) {
                            var rem = i % 3;

                            p[rem] || (p[rem] = []);
                            p[rem].push(c);
                            return p;
                        }, []);
                    });
                }
            });

            scope.setColor = function (color) {
                scope.selectedColor = color.hex;
                scope.onChange({newColor: color.hex});
            }
        }
    }
});