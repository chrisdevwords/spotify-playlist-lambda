const slack = require('./slack');
const { response } = require('./util/lambda');
const radio = require('./spotify/radio');


function handler(event, context, callback) {

    const { body = {} } = event;
    const {
        SPOTIFY_USER_ACCESS_TOKEN,
        SPOTIFY_LOCAL_URL,
        SPOTIFY_RADIO_PLAYLIST
    } = process.env;

    const { response_url } = body;
    const trackInfo = body.track;

    if (!trackInfo) {

        return callback(null, response({text: 'No track info.'}, 400))
    }

    radio
        .playBasedOnTrack(
            SPOTIFY_RADIO_PLAYLIST,
            trackInfo,
            SPOTIFY_USER_ACCESS_TOKEN,
            SPOTIFY_LOCAL_URL
        )
        .then(msg =>
            slack.notify(
                response_url,
                msg
            )
        )
        .catch(({ message }) =>
            slack.notify(
                response_url,
                `Error creating playlist: ${message}`,
                slack.TYPE_PRIVATE
            )
        );
    return callback(null, response({}));
}

module.exports = {
    handler
};
