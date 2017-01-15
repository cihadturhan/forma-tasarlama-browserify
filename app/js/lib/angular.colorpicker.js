require('angular')
    .module('main')
    .directive('colorPicker', function() {
    return {
        restrict: "E",
        scope: {
            selectedColor: "=",
            onChange: '&'
        },
        template: `<div class="ui compact menu">
                        <div class="ui bottom left simple dropdown button" ng-style="{backgroundColor: selectedColor}">
                          &nbsp;
                          <div class="menu">
                            <div class="item" ng-repeat="colorChunk in colorChunks">
                                <div class="color-box"  ng-repeat="color in colors" ng-style="{backgroundColor: color.value}" ng-click="setColor(color)">&nbsp;&nbsp;&nbsp;</div>
                            </div>
                          </div>
                        </div>
                      </div>`,
        link: function (scope, elem, attrs) {
            scope.colors = [
                {name: 'siyah', value: '#000000'},
                {name: 'beyaz', value: '#f2f2f2'},
                {name: 'yeşil', value: '#215b33'},
                {name: 'turuncu', value: '#fa3f00'},
                {name: 'kırmızı', value: '#d20016'},
                {name: 'mavi', value: '#0051ba'},
                {name: 'turkuaz', value: '#00a0c4'},
                {name: 'lacivert', value: '#03003d'},
                {name: 'neon yeşil', value: '#39ff14'},
                {name: 'neon pembe', value: '#ff0080'},
                {name: 'bordo', value: '#880d29'},
                {name: 'premium sarı', value: '#fb8917'},
                {name: 'füme', value: '#55595a'},
                {name: 'sarı', value: '#ffe800'},
                {name: 'mor', value: '#5c167e'}
            ];

            scope.colorChunks = colors.reduce(function(p, c, i){
                var rem = i % 3;
                var den = ~~(i/3)
                if(rem == 0)
                    p[rem]
                p[i%3].push
            },[]);

            scope.setColor = function (color) {
                scope.selectedColor = color.value;
                scope.onChange({newColor: color.value});
            }
        }
    }
});