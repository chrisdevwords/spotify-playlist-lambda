const PATH = require('path');
const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');
const dotenv = require('dotenv');
const token = require('../../../src/spotify/token');

const context = describe;

// dotenv.config();

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
                .getToken()
                .then((myToken) => {
                    expect(myToken).to.be.a('string');
                    expect(myToken).to.eq(accessToken);
                    done();
                })
                .catch(done);
        })
    });

    context('with an unsuccessful response', () => {
        it('throws a helpful error', (done) => {
            token
                .getToken()
                .then(() => {
                    done('This should throw an error');
                })
                .catch((err) => {
                    console.log('???', err);
                    done();
                })
                .catch(done);
        })
    });
});
