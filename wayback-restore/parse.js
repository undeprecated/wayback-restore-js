var debug = require("debug")("wayback:parse");

var mod_url = require("url");
var parse_domain = require("parse-domain");

const Wayback = {
    /**
     * Parses a wayback machine machine url into pieces.
     *
     * @param  {String} url http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk
     * @return {Object}     timestamp, domain
     */
    parse: from_url => {
        return {
            timestamp: Wayback.parseTimestamp(from_url),
            domain: Wayback.parseDomain(from_url)
        };
    },
    parseTimestamp: from_url => {
        let x = from_url;
        x = Wayback.strip(x);
        let [timestamp, web] = x.split("/", 1);

        return timestamp;
    },
    parseDomain: from_url => {
        let x = from_url;
        x = Wayback.strip(x);
        let [timestamp, web] = x.split("/", 1);
        web = x.replace(timestamp, "").replace("/", "");

        var myURL = mod_url.parse(web);
        var link = parse_domain(myURL.hostname);

        if (link) {
            return link.domain + "." + link.tld;
        } else {
            debug("Could not extract an archived link");
            return;
        }
    },
    strip: url => {
        let x = url;
        x = x.replace("http://web.archive.org/web/", "");
        x = x.replace("https://web.archive.org/web/", "");
        return x;
    }
};

module.exports = {
    parse: function(url) {
        return Wayback.parse(url);
    },
    parseDomain: function(url) {
        return Wayback.parseDomain(url);
    },
    parseTimestamp: function(url) {
        return Wayback.parseTimestamp(url);
    }
};
