"use string";

var setup = require("../setup");

var assert = setup.assert;
var process = setup.process;

describe("process.js", function() {
    describe("convertLinkToKey", function() {
        it("from url with trailing slash", function(done) {
            var link =
                "http://www.cashpropertysolutions.co.uk//need-a-quick-sale/";
            var key = "uk,co,cashpropertysolutions)/need-a-quick-sale";
            var domain = "cashpropertysolutions.co.uk";

            assert.equal(process.convertLinkToKey(domain, link), key);

            done();
        });

        it("from /", function(done) {
            var link = "http://www.cashpropertysolutions.co.uk/";
            var key = "uk,co,cashpropertysolutions)/";
            var domain = "cashpropertysolutions.co.uk";

            assert.equal(process.convertLinkToKey(domain, link), key);

            done();
        });
    });
});
