'use strict';

var app = require('angular').module('main');

app.service('containerService', require('./container'));
app.service('uniformService', require('./uniform'));
