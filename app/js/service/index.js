'use strict';

var app = require('angular').module('main');

app.service('containerService', require('./container'));
app.service('focusService', require('./focus'));
app.service('uniformService', require('./uniform'));
