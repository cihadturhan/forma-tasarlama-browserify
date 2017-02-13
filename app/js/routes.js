var app = angular.module('main');

app.run(['$rootScope', function($rootScope) {

        $rootScope.getUrl = function (obj, key) {
            return obj.contentUrl + '/' + obj['content'][key];

        };
    }]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/yaka-secimi');
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
        }
    ];

    // Loop over the state definitions and register them
    states.forEach(function(state) {
        state.resolve = {
            __: function($q, collarService, uniformService, uniformTypesService){
                return $q.when(collarService.getAll(), uniformService.getAll(), uniformTypesService.getAll());
            }
        };
        $stateProvider.state(state.name, state);
    });

});