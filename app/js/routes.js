var app = require('angular').module('main');

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/yaka-secimi');
    // An array of state definitions
    var states = [
        {
            name: 'collar',
            url: '/yaka-secimi',
            controller: 'collarCtrl',
            templateUrl: 'views/collar.html'
        },
        {
            name: 'uniform',
            url: '/:collar/forma-secimi',
            controller: 'uniformCtrl',
            templateUrl: 'views/uniform.html'
        },
        {
            name: 'color',
            url: '/:collar/:uniform/renk-secimi',
            controller: 'colorCtrl',
            templateUrl: 'views/color.html'
        },
        {
            name: 'payment',
            url: '/odeme',
            controller: 'paymentCtrl',
            templateUrl: 'views/payment.html'
        },
        {
            name: 'summary',
            url: '/ozet',
            controller: 'summaryCtrl',
            templateUrl: 'views/summary.html'
        }
    ];

    // Loop over the state definitions and register them
    states.forEach(function(state) {
        $stateProvider.state(state.name, state);
    });

});