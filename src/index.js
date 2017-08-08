const { response } = require('./util/lambda')

function handler(event, context, callback) {

    const { body } = event;

    callback(null, response({
        message: 'It works!',
        body: body
    }));
}

module.exports = {
    handler
};
