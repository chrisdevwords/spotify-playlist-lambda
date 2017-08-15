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

        const spotifyTrack = 'spotify:track:2771LMNxwf62FTAdpJMQfM';
        const notificationUri = encodeURIComponent('https://hooks.slack.com/commands/T4ZLYGVSN/227562856215/B4XvvRukWrmUzSJ0cMC0arpE');
        const slackBody = `text=${spotifyTrack}&token=foo_bar_baz&response_url=${notificationUri}`;
        const event = { body: slackBody };
        const trackInfo = {
            name: 'Bodak Yellow',
            artist: 'Cardi B',
            id: '2771LMNxwf62FTAdpJMQfM'
        };
        const respMsg = ''; //radio.SLACK_PENDING_MESSAGE(trackInfo);

        beforeEach(() => {
           sinon
               .stub(radio, 'playBasedOnTrack')
               .resolves(respMsg);

           sinon
               .stub(track, 'getTrackInfo')
               .resolves(trackInfo);

           // todo assert calls
           sinon
               .stub(slack, 'notify')
               .resolves({});

        });

        afterEach(() => {
            radio.playBasedOnTrack.restore();
            track.getTrackInfo.restore();
            slack.notify.restore();
        });

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
                        .to.eq(respMsg);
                    done()
                } catch (error) {
                    done(error);                        console.log('Send Slack notification that this worked:', msg, response_url);

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
