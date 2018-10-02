var expect = require('chai').expect;

var helper = require('../../lib/helpers');

describe("helpers.js", function() {
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
});