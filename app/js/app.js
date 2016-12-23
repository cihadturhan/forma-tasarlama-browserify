'use strict';

require('es5-shim');
require('es5-sham');

var jQuery = require('jquery');
var angular = require('angular');

require('angular-ui-router');
require('./lib/angular-colorpicker');

var app = angular.module('main', [ 'ui.colorpicker', 'ui.router' ]);

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');
require('./routes');

