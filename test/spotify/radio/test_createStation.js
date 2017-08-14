const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');
const {
    ERROR_EXPIRED_TOKEN,
    ERROR_INVALID_TRACK_URI,
} = require('../../../src/spotify');
const track = require('../../../src/spotify/track');
const playlist = require('../../../src/spotify/playlist');
const radio = require('../../../src/spotify/radio');


const context = describe;

config.includeStack = true;

describe('The spotify.radio.createStation method', () => {

    context('With an expired access token', () => {

        const playlistUri = 'spotify:user:awpoops:playlist:5PP1I2m0uxEBb3VKLhI7bP';
        const token = 'thistokenisexpired';
        const trackUri = 'spotify:track:5RgFlk1fcClZd0Y4SGYhqH';

        beforeEach(() => {
            sinon
                .stub(track, 'getTrackFeatures')
                .rejects({
                    statusCode: 401,
                    message: ERROR_EXPIRED_TOKEN
                });
        });

        afterEach(() => {
            track.getTrackFeatures.restore();
        });

        it('rejects with a 401 status code', (done) => {

           radio
                .createStation(
                    playlistUri,
                    trackUri,
                    token
                )
                .then(() => {
                    done('This promise should be rejected.')
                })
                .catch((err) => {
                    expect(err.statusCode).to.eq(401);
                    done();
                })
                .catch(done);
       });

       it('rejects with an error message saying the token is expired', (done) => {
           radio
               .createStation(
                   playlistUri,
                   trackUri,
                   token
               )
               .then(() => {
                   done('This promise should be rejected.')
               })
               .catch((err) => {
                   expect(err.message).to.eq(ERROR_EXPIRED_TOKEN);
                   done();
               })
               .catch(done);
       });
    });

    context('With a valid access token', () => {

        const token = 'avalidaccesstoken';
        const playlistUri = 'spotify:user:awpoops:playlist:5PP1I2m0uxEBb3VKLhI7bP';

        context('With a valid spotify track', () => {

            const trackInfo = {
                name: 'She\'s Always a Woman',
                artist: 'Billy Joel',
                artistIds: ['6zFYqv1mOsgBRQbae3JJ9e'],
                popularity: 70,
                id: '5RgFlk1fcClZd0Y4SGYhqH'
            };
            beforeEach(() => {

                sinon
                    .stub(track, 'getTrackFeatures')
                    .resolves({
                        danceability: 0.292,
                        energy: 0.324,
                        key: 3,
                        loudness: -11.996,
                        mode: 1,
                        speechiness: 0.0346,
                        acousticness: 0.797,
                        instrumentalness: 0.000473,
                        liveness: 0.12,
                        valence: 0.368,
                        tempo: 176.631,
                        duration_ms: 201373,
                        time_signature: 3
                    });
                sinon
                    .stub(radio, 'getRecommendationsFromTrack')
                    .resolves([
                        'spotify:track:3tWBLzt1QY9A9brUfWWEPO',
                        'spotify:track:1MSXGbvydpblJZYyiMdfaa',
                        'spotify:track:7wOD54k4zprUibDaa8dYv1',
                        'spotify:track:12nhoRghPNDChpsFaQld4a'
                    ]);
                sinon
                    .stub(playlist, 'populatePlaylist')
                    .resolves({})
                sinon
                    .stub(playlist, 'renamePlaylist')
                    .resolves({})
            });

            afterEach(() => {
                track.getTrackFeatures.restore();
                radio.getRecommendationsFromTrack.restore();
                playlist.populatePlaylist.restore();
                playlist.renamePlaylist.restore();

            });

            it('resolves with a message for slack', (done) => {
                radio
                    .createStation(
                        playlistUri,
                        trackInfo,
                        token
                    )
                    .then((message) => {
                        expect(message).to.eq(
                            'Radio: based on ' +
                            '"She\'s Always a Woman" by Billy Joel'
                        );
                        done();
                    })
                    .catch(done);
            });
        });

        context('With an invalid spotify track', () => {

            beforeEach(() => {
                sinon
                    .stub(track, 'getTrackFeatures')
                    .rejects({
                        statusCode: 400,
                        message: ERROR_INVALID_TRACK_URI
                    });
            });

            afterEach(() => {
                track.getTrackFeatures.restore();
            });

            const trackUri = 'spotify:foo:bar';

            it('rejects with a 400 status code', (done) => {
                radio
                    .createStation(
                        playlistUri,
                        trackUri,
                        token
                    )
                    .then(() => {
                        done('This promise should be rejected.')
                    })
                    .catch((err) => {
                        expect(err.message).to.eq(ERROR_INVALID_TRACK_URI);
                        expect(err.statusCode).to.eq(400);
                        done();
                    })
                    .catch(done);
            });
        });

        context('With a missing spotify track', () => {

            beforeEach(() => {
                sinon
                    .stub(track, 'getTrackFeatures')
                    .rejects({
                        statusCode: 404,
                        message: ERROR_INVALID_TRACK_URI
                    });
            });

            afterEach(() => {
                track.getTrackFeatures.restore();
            });

            const trackUri = 'spotify:track:xxxxxxxxxxxXXxxxxxx00x';
            it('rejects with a 400 status code', (done) => {
                radio
                    .createStation(
                        playlistUri,
                        trackUri,
                        token
                    )
                    .then(() => {
                        done('This promise should be rejected.')
                    })
                    .catch((err) => {
                        expect(err.message).to.eq(ERROR_INVALID_TRACK_URI);
                        expect(err.statusCode).to.eq(404);
                        done();
                    })
                    .catch(done);
            });
        });
    });
});
