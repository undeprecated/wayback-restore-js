var setup = require("../setup");

var Wayback = require("../../wayback-restore");

var expect = setup.expect;
var assert = setup.assert;

describe("restore.js", function () {
    describe("restore settings", function () {
        it("should accept a wayback url string", function () {
            const restore = Wayback.restore(
                "http://web.archive.org/web/20150531/http://www.example.com"
            );

            assert.isObject(restore.settings);
            assert.equal(restore.settings.domain, "example.com");
            assert.equal(restore.settings.timestamp, "20150531");
        });

        it("should accept an object with url", function () {
            const restore = Wayback.restore({
                url: "http://web.archive.org/web/20150531/http://www.example.com"
            });
            assert.isObject(restore.settings);
            assert.equal(restore.settings.domain, "example.com");
            assert.equal(restore.settings.timestamp, "20150531");
        });

        it("should accept an object domain and timestamp", function () {
            const restore = Wayback.restore({
                domain: "example.com",
                timestamp: "20150531"
            });
            assert.isObject(restore.settings);
            assert.equal(restore.settings.domain, "example.com");
            assert.equal(restore.settings.timestamp, "20150531");
        });
    });
});