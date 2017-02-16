'use strict';

var app = angular.module('main');

app.service('containerService', require('./container'));
app.service('uniformService', require('./uniform'));
app.service('gkUniformService', require('./gkUniform'));
app.service('shortService', require('./short'));
app.service('collarService', require('./collar'));
app.service('uuidService', require('./uuid'));
app.service('collarTypesService', require('./collarTypes'));
app.service('uniformTypesService', require('./uniformTypes'));
app.service('logoService', require('./logo'));
app.service('cacheService', require('./cache'));
app.service('colorService', require('./color'));
