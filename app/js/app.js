'use strict';

require('es5-shim');
require('es5-sham');

require('angular-ui-router');
require('ng-file-upload');

var app = angular.module('main', [ 'ui.router', 'ngFileUpload', 'ngAnimate', 'ui.bootstrap']);

require('./lib/angular.colorpicker');

app.constant('VERSION', require('../../package.json').version);

require('./service');
require('./controller');
require('./routes');

