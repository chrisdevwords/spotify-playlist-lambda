const { parseFormString } = require('./util/parse');
const {
    INVALID_TOKEN,
    TYPE_PRIVATE,
    TYPE_PUBLIC,
    slackResp
} = require('./slack');


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
        user_name
    } = parseFormString(event.body);

    if (token !== SLACK_TOKEN) {
        callback(null,
            slackResp(
                INVALID_TOKEN,
                401,
                TYPE_PRIVATE
            )
        );
    } else {

        // -- do stuff
        callback(null,
            slackResp(
                'It works.'
            )
        );
    }
}

module.exports = {
    handler
};
