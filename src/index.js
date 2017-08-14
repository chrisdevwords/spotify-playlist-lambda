const { parseFormString } = require('./util/parse');
const {
    INVALID_TOKEN,
    TYPE_PRIVATE,
    slackResp
} = require('./slack');
const { convertLinkToUri } = require('./spotify');
const radio = require('./spotify/radio');


function handler(event, context, callback) {

    const { body = '' } = event;
    const {
        SPOTIFY_USER_ACCESS_TOKEN,
        SPOTIFY_LOCAL_URL,
        SLACK_TOKEN,
        SPOTIFY_RADIO_PLAYLIST
    } = process.env;

    const {
        text,
        token,
    } = parseFormString(body);

    if (token !== SLACK_TOKEN) {
        callback(null,
            slackResp(
                INVALID_TOKEN,
                401,
                TYPE_PRIVATE
            )
        );
    } else {

        const trackUri = convertLinkToUri(text);
        radio
            .playBasedOnTrack(
                SPOTIFY_RADIO_PLAYLIST,
                trackUri,
                SPOTIFY_USER_ACCESS_TOKEN,
                SPOTIFY_LOCAL_URL
            )
            .then((msg) => {
                callback(null,
                    slackResp(msg)
                );
            })
            .catch((error) => {
                callback(null,
                    slackResp(error.message)
                );
            });
    }
}

module.exports = {
    handler
};
