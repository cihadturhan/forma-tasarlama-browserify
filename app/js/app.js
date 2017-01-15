'use strict';

require('es5-shim');
require('es5-sham');

window.$ = window.jQuery = require('jquery');
var angular = require('angular');

require('angular-ui-router');

var app = angular.module('main', [ 'ui.router' ]);

require('./lib/angular.colorpicker')

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');
require('./routes');

