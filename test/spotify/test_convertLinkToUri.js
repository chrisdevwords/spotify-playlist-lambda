const {describe, it} = require('mocha');
const { expect, config } = require('chai');
const { convertLinkToUri } = require('../../src/spotify');


const context = describe;

config.includeStack = true;

describe('#spotify.convertLinkToUri', () => {

    context('with an http link to a spotify track', () => {
        it('converts it to a uri', () => {
            const link = 'https://open.spotify.com/track/5uSXPDwXLpYF7aLmTnB3Mb';
            const uri = convertLinkToUri(link);
            expect(uri).to.equal('spotify:track:5uSXPDwXLpYF7aLmTnB3Mb');
        });
    });

    context('with a uri to a spotify track', () => {
        it('returns the uri as is', () => {
            const link = 'spotify:track:5uSXPDwXLpYF7aLmTnB3Mb';
            const uri = convertLinkToUri(link);
            expect(uri).to.equal('spotify:track:5uSXPDwXLpYF7aLmTnB3Mb');
        });
    });

    context('with a string that is not a spotify link', () => {
        it('doesn\'t break', () => {
            const link = 'https://developer.spotify.com/web-api/get-track/';
            const uri = convertLinkToUri(link);
            expect(uri).to.be.a('String');
        });
    });
});
