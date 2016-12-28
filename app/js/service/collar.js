'use strict';

module.exports = function ($http) {

    var collars = [
        {
            minimum: 7,
            description: 'Bisiklet (Yuvarlak) Yaka Futbol Formasi',
            src: 'yuvarlak',
            name: 'yuvarlak'
        },
        {
            minimum: 10,
            description: 'Polo Futbol Formasi',
            src: 'polo',
            name: 'polo'
        },
        {
            minimum: 9,
            description: 'V Yaka Futbol Formasi',
            src: 'v',
            name: 'v'
        },
        {
            minimum: 9,
            description: 'Y Yaka Futbol Formasi',
            src: 'y',
            name: 'y'
        }
    ];

    this.getAll = function () {
        return collars;
    };

    this.get = function (name) {
        return collars.find(function (c) {
            return c.name == name
        });
    }
};