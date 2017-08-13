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
            const token = 'BQDCP3FOWeE8e9a9lKUeu4JB0o1eN8UQzLvsWiyXgcr9RaPhM3o8L7XLXcopGnzl3vK4w8R_hlzy2-MW6x0PPS14b7CDMw_ctMcLUvWPLYEokMHKd9ENL-_fLwsRVhQFyHphY90hVYYthsizEWy8jdxMT_uptqf2auwAu6zhowkCxSYW9qG6F62_AkLQL5qu1t64DOmp4X8NtEP84ZGGiw11lbvGPl_wf6qS2ADuedQqxVSNoL4';

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