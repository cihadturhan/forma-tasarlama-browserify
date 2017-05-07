'use strict';

require('es5-shim');
require('es5-sham');

require('angular-ui-router');
require('ng-file-upload');
require('./util/functions');

var app = angular.module('main', [ 'ui.router', 'ngFileUpload', 'ngAnimate', 'ui.bootstrap']);

app.constant('VERSION', require('../../package.json').version);

require('./lib');
require('./service');
require('./controller');
require('./routes');

