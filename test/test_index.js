const PATH = require('path');
const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');
const { INVALID_TOKEN } = require('../src/slack');
const { handler } = require('../src');

const context = describe;


config.includeStack = true;
// uncomment to test with credentials from .env
// dotenv.config();
dotenv.config({
    path: PATH.resolve(__dirname, '../', 'test/.test-env')
});

describe('The Index Lambda Handler', () => {

    context('with a request event without a slack token', () => {
        const event = { };

        it('sends a response body that can be parsed as JSON ', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    const { text } = JSON.parse(resp.body);
                    expect(text)
                        .to.eq(INVALID_TOKEN);
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });

        it('sends a responseCode 401', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    expect(resp.statusCode)
                        .to.eq(401);
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    context('with an request event with a valid token', () => {

        const slackBody = `text=foo&token=${process.env.SLACK_TOKEN}`;
        const event = { body: slackBody };

        it('sends a response body', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    expect(resp.body)
                        .to.be.a('String');
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });

        it('sends a response body that can be parsed as JSON ', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    const { text } = JSON.parse(resp.body);
                    expect(text)
                        .to.eq('It works.');
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });

        it('sends a responseCode 200', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    expect(resp.statusCode)
                        .to.eq(200);
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });
    });
});
