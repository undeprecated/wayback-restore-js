'use string';

var setup = require('../setup');
var http = require('../../wayback-restore/http');
var assert = setup.assert;

describe("http.js", function () {

    describe("download()", function () {
        it("can download", async () => {
            const url = "https://web.archive.org/web/20150531065350id_/http://www.cashpropertysolutions.co.uk/";
            const data = await http.download(url);
            assert.isNotEmpty(data);
        });
    });
});