'use string';

var setup = require('../setup');

var assert = setup.assert;
var asset = setup.asset;

describe("asset.js", function() {

    describe("convertLinkToKey", function() {
        it("from url with trailing slash", function(done) {
            var link = "http://www.cashpropertysolutions.co.uk//need-a-quick-sale/";
            var key = "uk,co,cashpropertysolutions)/need-a-quick-sale";
            var domain = "cashpropertysolutions.co.uk";

            assert.equal(asset.convertLinkToKey(domain, link), key);

            done();
        });

        it("from /", function(done) {
            var link = "http://www.cashpropertysolutions.co.uk/";
            var key = "uk,co,cashpropertysolutions)/";
            var domain = "cashpropertysolutions.co.uk";

            assert.equal(asset.convertLinkToKey(domain, link), key);

            done();
        });
    });
});