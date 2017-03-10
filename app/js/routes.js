var app = angular.module('main');

app.run(['$rootScope', '$window', function ($rootScope, $window) {

    $rootScope.isMobile = $window.innerWidth < 992;

    angular.element($window).bind('resize', function () {

        $rootScope.isMobile = $window.innerWidth < 992;

        // manuall $digest required as resize event
        // is outside of angular
        $rootScope.$digest();
    });

    $rootScope.popupDirection = function(){
        return $rootScope.isMobile ? 'top': 'left';
    };


    $rootScope.getUrl = function (obj, key) {
        return obj.contentUrl + '/' + obj['content'][key];

    };
}]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/yaka-secimi/');
    // An array of state definitions
    var states = [
        {
            name: 'collar',
            url: '/yaka-secimi/',
            controller: 'collarCtrl',
            templateUrl: 'views/collar.html'
        },
        {
            name: 'uniform',
            url: '/:collar/forma-secimi/',
            controller: 'uniformCtrl',
            templateUrl: 'views/uniform.html'
        },
        {
            name: 'color',
            url: '/:collar/:uniform/:colorUuid/',
            controller: 'colorCtrl',
            templateUrl: 'views/color.html',
        },
        {
            name: 'payment',
            url: '/:collar/:uniform/:colorUuid/:paymentUuid/',
            controller: 'paymentCtrl',
            templateUrl: 'views/payment.html'
        },
        {
            name: 'summary',
            url: '/:collar/:uniform/:colorUuid/:paymentUuid/:summaryUuid/',
            controller: 'summaryCtrl',
            templateUrl: 'views/summary.html'
        },
        {
            name: 'final',
            url: '/final/',
            controller: 'finalCtrl',
            templateUrl: 'views/final.html'
        }
    ];

    // Loop over the state definitions and register them
    states.forEach(function (state) {
        state.resolve = {
            __: function ($q, collarService, uniformService, uniformTypesService, colorService) {
                return $q.all([collarService.getAll(), uniformService.getAll(), uniformTypesService.getAll(), colorService.getAll()]);
            }
        };
        $stateProvider.state(state.name, state);
    });

});