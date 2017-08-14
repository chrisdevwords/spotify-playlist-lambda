const { parseFormString } = require('./util/parse');
const {
    INVALID_TOKEN,
    TYPE_PRIVATE,
    slackResp
} = require('./slack');
const {
    convertLinkToUri,
    extractFromUri
} = require('./spotify');
const radio = require('./spotify/radio');
const track = require('./spotify/track');


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
        response_url
    } = parseFormString(body);

    console.log('INCOMING SLACK MESSAGE', body);

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
        track
            .getTrackInfo(
                extractFromUri(trackUri, 'track'),
                SPOTIFY_USER_ACCESS_TOKEN
            )
            .catch((error) => {
                callback(null,
                    slackResp(error.message)
                );
            })
            .then((trackInfo) => {
                callback(null,
                    slackResp(radio.SLACK_PENDING_MESSAGE(trackInfo))
                );
                radio
                    .playBasedOnTrack(
                        SPOTIFY_RADIO_PLAYLIST,
                        trackUri,
                        SPOTIFY_USER_ACCESS_TOKEN,
                        SPOTIFY_LOCAL_URL
                    )
                    .then((msg) => {
                        console.log('Send Slack notification that this worked:', msg, response_url);
                    })
                    .catch(({ message }) => {
                        console.log('Send Slack notification that this failed:', message, response_url);
                    });
            });

    }
}

module.exports = {
    handler
};
