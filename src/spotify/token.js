const request = require('request-promise-native');

const TOKEN_ERROR = 'Error getting Spotify Token';

const API_BASE = 'https://api.spotify.com/';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TRACK_ENDPOINT = trackId => `${API_BASE}v1/tracks/${trackId}`;


module.exports = {

    getToken() {

        const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env;
        const creds = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_SECRET}`;
        const encoded = new Buffer(creds).toString('base64');

        return request
            .post({
                uri: TOKEN_ENDPOINT,
                headers: {
                    Authorization: `Basic ${encoded}`,
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            })
            .then((resp) => {
                return resp;
            })
            .then(resp =>
                JSON.parse(resp).access_token
            )
            .catch((errorResp) => {
                const { statusCode = 500 } = errorResp;
                const err = new Error(TOKEN_ERROR);
                err.statusCode = statusCode;
                throw err;
            });

    }
};
