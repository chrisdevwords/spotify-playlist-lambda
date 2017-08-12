const { response } = require('./util/lambda')

function handler(event, context, callback) {

    const { body } = event;
    const {
        SPOTIFY_USER_ACCESS_TOKEN,
        SPOTIFY_LOCAL_URL,
        SLACK_TOKEN
    } = process.env;

    let message = 'no token...';
    if (SPOTIFY_USER_ACCESS_TOKEN) {
        message = 'It works!'
    }
    callback(null, response({
        message,
        body
    }));
}

module.exports = {
    handler
};
