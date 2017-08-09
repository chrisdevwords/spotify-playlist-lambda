const request = require('request-promise-native');
const { API_BASE } = require('../spotify');


const TOKEN_ERROR = 'Error getting Spotify Token';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

module.exports = {

    TOKEN_ERROR,

    getToken(clientId, secret) {

        const creds = `${clientId}:${secret}`;
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
