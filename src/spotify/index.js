const API_BASE = 'https://api.spotify.com/v1';
const ERROR_EXPIRED_TOKEN = 'Spotify User Access token ' +
    'is expired or invalid. ' +
    'Please check the Spotify host machine.';

const ERROR_INVALID_TRACK_URI = 'Please provide a uri ' +
    'for a valid Spotify track.';

module.exports = {
    API_BASE,
    ERROR_EXPIRED_TOKEN,
    ERROR_INVALID_TRACK_URI,
    convertLinkToUri(link) {
        return link
            .replace('https://open.spotify.com', 'spotify')
            .split('/').join(':');
    },
    extractFromUri(uri, property) {
        const arr = uri.split(':');
        const propIndex = arr.indexOf(property);
        if (propIndex === -1) {
            return undefined;
        }
        return arr[propIndex + 1];
    }
};
