'use strict';

module.exports = function($http){

    var uniforms = [
        {
            description: 'Point',
            src: 'forma',
            name: 'point'
        },
        {
            description: 'Splash',
            src: 'forma',
            name: 'splash'
        },
        {
            description: 'Atlas',
            src: 'forma',
            name: 'atlas'
        },
        {
            description: 'Limbo',
            src: 'forma',
            name: 'limbo'
        }
    ];

    this.getAll = function() {
        return uniforms;
    };

    this.get = function (name) {
        return uniforms.find(function (c) {
            return c.name == name
        });
    }
};