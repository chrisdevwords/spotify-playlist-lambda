const { response } = require('./util/lambda')

function handler(event, context, callback) {

    const { body } = event;
    const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env;

    callback(null, response({
        message: 'It works!',
        body: body
    }));
}

module.exports = {
    handler
};
