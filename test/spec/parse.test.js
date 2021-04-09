var setup = require("../setup");
var parse = require("../../wayback-restore/utils");

var expect = setup.expect;

describe("parse.js", function () {
    describe("parseDomain", function () {
        it("can parse the domain", function () {
            expect(
                parse.parseDomain(
                    "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
                )
            ).to.equal("cashpropertysolutions.co.uk");
        });

        it("can parse domain without http", function () {
            expect(
                parse.parseDomain(
                    "http://web.archive.org/web/20150531/example.com"
                )
            ).to.equal("example.com");
        });

        it("can parse domain without http with subdomain", function () {
            expect(
                parse.parseDomain(
                    "http://web.archive.org/web/20150531/www.example.com"
                )
            ).to.equal("example.com");
        });
    });

    describe("parseTimestamp", function () {
        it("can parse timestamp", function () {
            expect(
                parse.parseTimestamp(
                    "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
                )
            ).to.equal("20150531");
        });
    });

    describe("parse", function () {
        var r = parse.parse(
            "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
        );

        it("should return an object", function () {
            expect(r).to.be.instanceOf(Object);
        });

        it("should have a domain property", function () {
            expect(r).to.have.property("domain");
        });

        it("should have a timestamp property", function () {
            expect(r).to.have.property("timestamp");
        });

        it("can parse timestamp", function () {
            expect(r.timestamp).to.equal("20150531");
        });

        it("can parse domain", function () {
            expect(r.domain).to.equal("cashpropertysolutions.co.uk");
        });
    });
});