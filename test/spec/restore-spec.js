var Restore = require('../../src/WaybackMachine');

describe("Restore", function() {
    describe("removes web.archive.org", function() {

        it("from https://web.archive.org/web/20150531065350", function() {
            var link = "https://web.archive.org/web/20150531065350/http://www.cashpropertysolutions.co.uk/wp-content/uploads/2013/10/anyproperty2.png";
            var answer = "http://www.cashpropertysolutions.co.uk/wp-content/uploads/2013/10/anyproperty2.png";
            var domain = 'cashpropertysolutions.co.uk';

            expect(Restore.rewriteLink(domain, link)).toBe(answer);
        });

    });
});