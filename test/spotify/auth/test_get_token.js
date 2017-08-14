const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const token = require('../../../src/spotify/auth');

const context = describe;

config.includeStack = true;

describe('The spotify.token.getToken method', () => {

    context('with a successful response', () => {

        const accessToken = 'foo-bar-baz_123';

        beforeEach(() => {
            sinon
                .stub(request, 'post')
                .resolves(JSON.stringify({
                    access_token: accessToken
                }));

        });

        afterEach(() => {
            request.post.restore();
        });

        it('parses a token', (done) => {
            token
                .getToken('foo', 'bar')
                .then((myToken) => {
                    expect(myToken).to.be.a('string');
                    expect(myToken).to.eq(accessToken);
                    done();
                })
                .catch(done);
        })
    });

    context('with an unsuccessful response', () => {

         beforeEach(() => {
            sinon
                .stub(request, 'post')
                .rejects({ statusCode: 400 });

        });

        afterEach(() => {
            request.post.restore();
        });

        it('throws an error with the returned status code', (done) => {
            token
                .getToken('foo', 'bar')
                .then(() => {
                    done('This should throw an error');
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode).to.eq(400);
                    expect(message).to.eq(token.TOKEN_ERROR);
                    done();
                })
                .catch(done);
        })
    });

    context('with an internal', () => {

         beforeEach(() => {
            sinon
                .stub(request, 'post')
                .resolves('This is not JSON. Something is up with Spotify...');

        });

        afterEach(() => {
            request.post.restore();
        });

        it('throws an error with a 500 statusCode', (done) => {
            token
                .getToken('foo', 'bar')
                .then(() => {
                    done('This should throw an error');
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode).to.eq(500);
                    expect(message).to.eq(token.TOKEN_ERROR);
                    done();
                })
                .catch(done);
        })
    });
});
