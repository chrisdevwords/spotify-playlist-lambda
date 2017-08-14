const { parseFormString } = require('./util/parse');
const slack = require('./slack');
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

    console.log('PROCESSING SLACK COMMAND', text, response_url, SPOTIFY_RADIO_PLAYLIST)

    if (token !== SLACK_TOKEN) {
        callback(null,
            slack.slackResp(
                slack.INVALID_TOKEN,
                401,
                slack.TYPE_PRIVATE
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
                console.log(error);
                callback(null,
                    slack.slackResp(error.message)
                );
            })
            .then((trackInfo) => {
                callback(null,
                    slack.slackResp(radio.SLACK_PENDING_MESSAGE(trackInfo))
                );
                radio
                    .playBasedOnTrack(
                        SPOTIFY_RADIO_PLAYLIST,
                        trackInfo,
                        SPOTIFY_USER_ACCESS_TOKEN,
                        SPOTIFY_LOCAL_URL
                    )
                    .then((msg) => {
                        console.log('notify success', response_url, msg);
                        slack.notify(
                            response_url,
                            msg
                        );
                    })
                    .catch(({ message }) => {
                        console.log('notify error', response_url, message);
                        slack.notify(
                            response_url,
                            `Error creating playlist: ${message}`,
                            slack.TYPE_PRIVATE
                        )
                    });
            });

    }
}

module.exports = {
    handler
};
