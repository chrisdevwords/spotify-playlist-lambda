const PATH = require('path');
const { beforeEach, afterEach, describe, it } = require('mocha');
const { expect, config } = require('chai');
const request = require('request-promise-native');
const sinon = require('sinon');

const { handler } = require('../src');

const context = describe;


config.includeStack = true;

describe('The Index Lambda Handler', () => {
    context('with an request event', () => {

        const event = { body: {} };

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
                    const { message } = JSON.parse(resp.body);
                    expect(message)
                        .to.eq('It works!');
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
