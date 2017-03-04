var app = angular.module('main');

var template = '' +
    '<div class="btn-group colors" data-toggle="buttons">' +
    '   <label  ng-repeat="color in ::colors track by color.hex"' +
    '           class="btn btn-primary" ' +
    '           ng-style="{backgroundColor: color.hex}" ' +
    '           tooltip-append-to-body="true" ' +
    '           uib-tooltip="{{color.name}}" ' +
    '           ng-click="$parent.setColor(color)" ' +
    '           ng-class="{active: color == selectedColor}">' +
    '       <span ng-show="color == selectedColor" class="glyphicon glyphicon-ok"></span>' +
    '   </label> ' +
    '</div>';


app.directive('colorPicker', function (colorService, $sce) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            selectedColor: "=",
            onChange: '&'
        },
        template: template,
        link: function (scope, elem, attrs) {
            colorService.getAll().then(function (response) {
                scope.colors = response.data;
            });

            scope.setColor = function (color) {
                scope.selectedColor = color;
                scope.onChange({newColor: color});
            }
        }
    }
});