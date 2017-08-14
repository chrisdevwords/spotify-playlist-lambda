const request = require('request-promise-native');
const {
    API_BASE,
    extractFromUri
} = require('../spotify');

const PLAYLIST_ENDPOINT = (user, id) =>
    `${API_BASE}/users/${user}/playlists/${id}`;

const PLAYLIST_TRACKS_ENDPOINT = (user, id) =>
    `${PLAYLIST_ENDPOINT(user, id)}/tracks`;


module.exports = {

    renamePlaylist(playlist, name, accessToken) {

        const userId = extractFromUri(playlist, 'user');
        const playlistId = extractFromUri(playlist, 'playlist');

        return request
            .put({
                json: true,
                uri: PLAYLIST_ENDPOINT(userId, playlistId),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                },
                body: {
                    name
                }
            });
    },

    populatePlaylist(playlist, uris, accessToken) {

        const userId = extractFromUri(playlist, 'user');
        const playlistId = extractFromUri(playlist, 'playlist');

        return request
            .put({
                json: true,
                uri: PLAYLIST_TRACKS_ENDPOINT(userId, playlistId),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                },
                body: {
                    uris
                }
            });
    }
};
