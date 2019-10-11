var url = require("url");
var parseDomain = require("parse-domain");

const Wayback = {
    parse: url => {
        let x = url;
        x = Wayback.strip(x);
        let [timestamp, web] = x.split("/", 1);

        web = x.replace(timestamp, "");

        return {domain: parseDomain(web), timestamp: timestamp};
    },
    strip: url => {
        let x = url;
        x = x.replace("http://web.archive.org/web/", "");
        x = x.replace("https://web.archive.org/web/", "");
        return x;
    }
};

function parseTimestamp(url) {
    let x = url;
    x = Wayback.strip(x);
    let [timestamp, web] = x.split("/", 1);
    return timestamp;
}

function parseDomain(href) {
    //var domain = href.replace(ARCHIVE_SOURCE, '');

    var myURL = url.parse(href);

    //var matches = myURL.pathname.match(/http.*/gi);

    //if (matches) {
    //var link = parseDomain(url.parse(matches[0]).hostname);
    var link = parseDomain(myURL.hostname);

    if (link) {
        return link.domain + "." + link.tld;
    }
    //}

    debug("Could not extract an archived link");
    return;
}

module.exports = {
    parseDomain: function(url) {
        return parseDomain(url);
    },
    parseTimestamp: function(url) {
        return Wayback.parse(url).timestamp;
    },
    parse: function(url) {
        return Wayback.parse(url);
    }
};
