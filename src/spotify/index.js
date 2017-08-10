const API_BASE = 'https://api.spotify.com/';

module.exports = {
    API_BASE,

    extractFromUri(uri, property) {
        const arr = uri.split(':');
        const propIndex = arr.indexOf(property);
        if (propIndex === -1) {
            return undefined;
        }
        return arr[propIndex + 1];
    }
};
