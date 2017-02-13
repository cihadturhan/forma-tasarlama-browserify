var sizes = {
    width: 4000,
    height: 5764
};

sizes.wHalf = sizes.width / 2;
sizes.hHalf = sizes.height / 2;

var absScale = 0.2;

var constants = {
    sizes: sizes,
    absScale: absScale
};

constants.container = {
    width: sizes.width * absScale,
    height: sizes.height * absScale,
    wHalf: sizes.wHalf * absScale,
    hHalf: sizes.hHalf * absScale
};

constants.faces = {
    FRONT: 'FRONT',
    BACK: 'BACK',
    BOTH: 'BOTH'
};

constants.backendHost = 'http://formatasarlama';


module.exports = constants;