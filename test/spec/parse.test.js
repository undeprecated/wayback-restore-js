var setup = require("../setup");

var parse = require("../../wayback-restore");
//var helper = require('../../lib/helpers');

var expect = setup.expect;

describe("parse.js", function() {
    describe("parseDomain", function() {
        it("can parse the domain", function() {
            expect(
                parse.parseDomain(
                    "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
                )
            ).to.equal("cashpropertysolutions.co.uk");
        });
    });

    describe("parseTimestamp", function() {
        it("can parse timestamp", function() {
            expect(
                parse.parseTimestamp(
                    "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
                )
            ).to.equal("20150531");
        });
    });

    describe("parse", function() {
        var r = parse.parse(
            "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
        );

        it("should return an object", function() {
            expect(r).to.be.instanceOf(Object);
        });

        it("should have a domain property", function() {
            expect(r).to.have.property("domain");
        });

        it("should have a timestamp property", function() {
            expect(r).to.have.property("timestamp");
        });
    });
});

/*
describe("parseDomainToRestore", function() {

    it("from http://www.cashpropertysolutions.co.uk/", function() {
        var url = "http://www.cashpropertysolutions.co.uk/";
        var domain = 'cashpropertysolutions.co.uk';

        expect(helper.parseDomainToRestore(url)).toBe(domain);
    });

    it("from http://www.cashpropertysolutions.co.uk/wp-content/uploads/2013/10/anyproperty2.png", function() {
        var url = "http://www.cashpropertysolutions.co.uk/wp-content/uploads/2013/10/anyproperty2.png";
        var domain = 'cashpropertysolutions.co.uk';

        expect(helper.parseDomainToRestore(url)).toBe(domain);
    });

});
*/
