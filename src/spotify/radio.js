const request = require('request-promise-native');
const {
    API_BASE,
    extractFromUri
} = require('../spotify');
const playlist = require('../spotify/playlist');
const track = require('../spotify/track');


// Response templates
const PLAYLIST_NAME = basedOn =>
    `Radio: based on ${basedOn}`;
const TRACK_NAME = (artist, songName) =>
    `"${songName}" by ${artist}`;

const RECCOMENDED_TRACKS_ENDPOINT = `${API_BASE}/recommendations`;

module.exports = {

    PLAYLIST_NAME,

    getRecommendationsFromTrack(trackId, trackInfo, accessToken) {

        const { energy, valence, popularity } = trackInfo;

        return request
            .get({
                uri: RECCOMENDED_TRACKS_ENDPOINT,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                json: true,
                qs: {
                    limit: 100,
                    seed_tracks: trackId,
                    seed_artists: trackInfo.artistIds.join(','),
                    max_popularity: popularity,
                    target_energy: energy,
                    target_valence: valence,
                    market:'US'
                }
            })
            .then(({ tracks }) => tracks.map(({ uri }) => uri));
    },

    createStation(playlistUri, spotifyUri, accessToken) {


        const trackId = extractFromUri(spotifyUri, 'track');
        let playlistName;

        return track
            .getTrackInfo(trackId, accessToken)
            .then((info) => {
                playlistName = PLAYLIST_NAME(
                    TRACK_NAME(info.artist, info.name)
                );
                return track
                    .getTrackFeatures(trackId, accessToken)
                    .then(features => Object.assign(info, features))
            })
            .then(trackInfo =>
                this.getRecommendationsFromTrack(
                    trackId,
                    trackInfo,
                    accessToken
                )
            )
            .then(uris =>
                playlist.populatePlaylist(playlistUri, uris, accessToken)
            )
            .then(() =>
                playlist.renamePlaylist(playlistUri, playlistName, accessToken)
            )
            .then(() => playlistName)
            .catch((err) => {
                if (err.error) {
                    const error = Error(err.error.error.message);
                    error.statusCode = err.statusCode;
                    throw error;
                }
                return Promise.reject(err)
            });
    }
};
