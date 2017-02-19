
var app = angular.module('main');

app.directive('onCarouselChange', function ($parse) {
    return {
        require: 'uibCarousel',
        link: function (scope, element, attrs, carouselCtrl) {
            var fn = $parse(attrs.onCarouselChange);
            var origSelect = carouselCtrl.select;
            carouselCtrl.select = function (nextSlide, direction) {
                var currentSlide = this.slides[this.getCurrentIndex()];
                if (nextSlide && currentSlide && nextSlide !== currentSlide) {
                    fn(scope, {
                        nextSlide: nextSlide,
                        direction: direction,
                    });
                }
                return origSelect.apply(this, arguments);
            };
        }
    };
});