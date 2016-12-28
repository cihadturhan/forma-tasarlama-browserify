'use strict';

var app = require('angular').module('main');

app.service('containerService', require('./container'));
app.service('uniformService', require('./uniform'));
app.service('collarService', require('./collar'));
