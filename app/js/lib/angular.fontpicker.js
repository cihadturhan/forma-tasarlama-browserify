var app = angular.module('main');

var template = '' +
    '<div data-toggle="buttons">' +
    '   <label  ng-repeat="font in fonts"' +
    '           class="btn btn-primary" ' +
    '           ng-style="{fontFamily: font}" ' +
    '           ng-click="$parent.setFont(font)" ' +
    '           ng-class="{active: font == selectedFont}">' +
    '       {{font}}' +
    '   </label> ' +
    '</div>';


app.directive('fontPicker', function (colorService, $sce) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            selectedFont: "=",
            onChange: '&'
        },
        template: template,
        link: function (scope, elem, attrs) {
            scope.fonts = ['Arial', 'Oswald', 'Mada', 'Noto Sans', 'Roboto', 'Open Sans'];
            colorService.getAll().then(function (response) {
                scope.colors = response.data;
            });

            scope.setFont = function (font) {
                scope.selectedFont = font;
                scope.onChange({newFont: font});
            }
        }
    }
});