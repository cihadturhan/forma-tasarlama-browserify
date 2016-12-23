'use strict';

module.exports = function($http){

    this.get = function() {
        return [
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
    }
};