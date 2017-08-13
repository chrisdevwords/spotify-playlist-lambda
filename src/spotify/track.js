const request = require('request-promise-native');
const {
    API_BASE,
    ERROR_EXPIRED_TOKEN,
    ERROR_INVALID_TRACK_URI,
    extractFromUri
} = require('../spotify');

// Endpoint templates
const TRACK_ENDPOINT = id =>
    `${API_BASE}/tracks/${id}`;

const TRACK_FEATURES_ENDPOINT = trackId =>
    `${API_BASE}/audio-features/${trackId}`;

module.exports = {

    getTrackInfo(trackId, accessToken) {
        return request.get({
            uri: TRACK_ENDPOINT(trackId),
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true
        }).then(({ artists, name, popularity }) => ({
            name,
            artist:  artists.map(a => a.name).join(', '),
            artistIds: artists.map(a => extractFromUri(a.uri, 'artist')),
            popularity
        }))
            .catch((err) => {
                if (err.error) {
                    let message;
                    switch (err.statusCode) {
                        case 404:
                        case 400:
                            message = ERROR_INVALID_TRACK_URI;
                            break;
                        case 401:
                            message = ERROR_EXPIRED_TOKEN;
                            break;
                        default:
                            message = err.error.error.message;
                    }
                    const error = Error(message);
                    error.statusCode = err.statusCode;
                    throw error;
                }
                return Promise.reject(err)
            });
    },

    getTrackFeatures(trackId, accessToken) {
        return request.get(
            {
                uri: TRACK_FEATURES_ENDPOINT(trackId),
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                json: true
            }
        )
    },
};
