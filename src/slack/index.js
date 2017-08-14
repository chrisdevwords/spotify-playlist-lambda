const request = require('request-promise-native');
const { response } = require('../util/lambda')

// response types
const TYPE_PRIVATE = 'ephemeral';
const TYPE_PUBLIC = 'in_channel';

// error messages
const INVALID_TOKEN = 'Slack token is invalid.';

function slackResp(text, code = 200, type = TYPE_PUBLIC) {
    return response({
        // eslint-disable-next-line camelcase
        response_type: type,
        text
    }, code);
}

module.exports = {
    TYPE_PUBLIC,
    TYPE_PRIVATE,
    INVALID_TOKEN,
    slackResp,
    notify(uri, text) {
        return request
            .post({
                uri,
                headers: {
                    'content-type': 'application/json'
                },
                body: {
                    text
                },
                json: true
            })
    }
};
