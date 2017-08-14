const request = require('request-promise-native');
const {
    API_BASE
} = require('../spotify');
const playlist = require('../spotify/playlist');
const track = require('../spotify/track');


// Response templates
const PLAYLIST_NAME = basedOn =>
    `Radio: based on ${basedOn}`;
const TRACK_NAME = (artist, songName) =>
    `"${songName}" by ${artist}`;

const RECCOMENDED_TRACKS_ENDPOINT = `${API_BASE}/recommendations`;
const SLACK_SUCCESS_MESSAGE = playlistName =>
    `Playlist changed to ${playlistName}`;

const SLACK_PENDING_MESSAGE = ({ name, artist }) =>
    `Finding tracks based on: ${TRACK_NAME(artist, name)}...`;

module.exports = {

    PLAYLIST_NAME,
    TRACK_NAME,
    SLACK_SUCCESS_MESSAGE,
    SLACK_PENDING_MESSAGE,

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

    createStation(playlistUri, trackInfo, accessToken) {

        const trackId = trackInfo.id;
        const playlistName = PLAYLIST_NAME(
            TRACK_NAME(trackInfo.artist, trackInfo.name)
        );

        return track
            .getTrackFeatures(trackId, accessToken)
            .then(features =>
                this.getRecommendationsFromTrack(
                    trackId,
                    Object.assign(features, trackInfo),
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
    },

    playBasedOnTrack(playlistUri, trackUri, accessToken, spotifyLocalUrl) {

        return this
            .createStation(playlistUri, trackUri, accessToken)
            .then(() =>
                request
                    .post({
                        uri: `${spotifyLocalUrl}/api/spotify/playlist`,
                        body: {
                            playlist: playlistUri
                        },
                        json: true
                    })
            )
            .then(resp =>
                SLACK_SUCCESS_MESSAGE(resp.playlist.title)
            );
    }
};
