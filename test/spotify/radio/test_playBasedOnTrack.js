const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const radio = require('../../../src/spotify/radio');


const context = describe;

config.includeStack = true;

describe('The spotify.radio.playBasedOnTrack method', () => {

    context('with a working spotifyLocal connection', () => {

        const playlistName =  radio.PLAYLIST_NAME(
            '"Everyone" by Van Morrison'
        );

        beforeEach(() => {
            sinon
                .stub(radio, 'createStation')
                .resolves({})

            sinon
                .stub(request, 'post')
                .resolves({
                    playlist: {
                        title: playlistName
                    }
                })

        });

        afterEach(() => {
            radio.createStation.restore();
            request.post.restore();
        });

        it('resolves with a message for slack', (done) => {

            const trackUri = 'spotify:track:528kEbmXBOuMbxdn7YQAXx';
            const spotifyLocalUrl = 'http://localhost:5000';
            const playlistUri = 'spotify:user:awpoops:playlist:5PP1I2m0uxEBb3VKLhI7bP';
            const token = 'assume_this_is_valid';
            radio
                .playBasedOnTrack(playlistUri, trackUri, token, spotifyLocalUrl)
                .then((message) => {
                    expect(message).to.equal(
                        radio.SLACK_SUCCESS_MESSAGE(playlistName)
                    )
                    done();
                })
                .catch(done);
        })
    });
});