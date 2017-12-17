const PATH = require('path');
const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');
const { INVALID_TOKEN } = require('../src/slack');
const { handler } = require('../src');
const slack = require('../src/slack');
const radio = require('../src/spotify/radio');
const track = require('../src/spotify/track');

const context = describe;


config.includeStack = true;
// uncomment to test with credentials from .env
dotenv.config({
    path: PATH.resolve(__dirname, '../', 'test/.test-env')
});

describe('The Index Lambda Handler', () => {

    context('with a request event without a body', () => {
        const event = {};

        it('sends a response body that can be parsed as JSON ', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    const { text } = JSON.parse(resp.body);
                    expect(text)
                        .to.equal('No track info.');
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
                        .to.eq(400);
                    done()
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    context('with a request event with a valid token', () => {

        const notificationUri = encodeURIComponent('https://hooks.slack.com/commands/T4ZLYGVSN/227562856215/B4XvvRukWrmUzSJ0cMC0arpE');
        const trackInfo = {
            name: 'Bodak Yellow',
            artist: 'Cardi B',
            id: '2771LMNxwf62FTAdpJMQfM'
        };
        const event = { body: { track: trackInfo, response_url: notificationUri } };
        const respMsg = 'No track info.'; //radio.SLACK_PENDING_MESSAGE(trackInfo);

        beforeEach(() => {
           sinon
               .stub(radio, 'playBasedOnTrack')
               .resolves(respMsg);

           sinon
               .stub(slack, 'notify')
               .resolves({});

        });

        afterEach(() => {
            radio.playBasedOnTrack.restore();
            slack.notify.restore();
        });

        it('sends a response body', (done) => {
            handler(event, {}, (err, resp) => {
                try {
                    expect(JSON.parse(resp.body).statusCode)
                        .to.eq(200);
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
