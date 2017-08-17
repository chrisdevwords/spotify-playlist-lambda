const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');
const {
    ERROR_EXPIRED_TOKEN,
    ERROR_INVALID_TRACK_URI,
} = require('../../../src/spotify');
const playlist = require('../../../src/spotify/playlist');


const context = describe;

config.includeStack = true;

describe.skip('The spotify.playlist.populatePlaylist method', () => {

    context('With an access token', () => {

        it('resolves with a message for slack', (done) => {
            const token = 'BQBGZokmDC6rPIo-RdD2gAIPFuapy-2KAGJ7M6wuuPf-5XyW_rIBh1ev6YHH6mbYoB3wE9jap7G3FPuOwxdAG2bXXfDVBVaGx_zJzuWzcEig1aUitSp22ELC8yfC5XJL-K1EMKuRvPPuVNWhIY5Q9CZi6RXGSWaVYNsdVlsi396NfArtgjBFvWSplqaXM0iGTwboVB8-p1Mot0B9yHcoKgLvS8UaO6btp3ioLpwJ2qlTOE_robc';
            const playlistUri = 'spotify:user:awpoops:playlist:5PP1I2m0uxEBb3VKLhI7bP';
            const tracks = ['spotify:track:0FCGC8NabDAb3fsS5bPDU7'];
            playlist
                .populatePlaylist(playlistUri, tracks, token)
                .then(() => {
                    done();
                })
                .catch(done);
        });
    })
});
