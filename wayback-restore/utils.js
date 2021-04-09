/* jshint node:true */
/* global define, require, module */

"use strict";

var os = require('os');
var url = require('url');
var path = require('path');
var mod_url = require("url");
var parse_domain = require("parse-domain");

var core = require('./core');

var debug = require('debug')('wayback:utils');

/**
 * Convert a URL to relative path by removing the hostname.
 *
 * @param {string} str A URL.
 * @return {string} A relative URL.
 */
function makeRelative(str) {
    var nstr = url.parse(str);

    if (nstr.path) {
        nstr = nstr.path.replace(/^\/+/i, '');
    }

    nstr = '/' + nstr;

    return nstr;
}

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(os.homedir(), filepath.slice(1));
    } else {
        return filepath;
    }
}

function convertLinkToKey(domain, link) {
    var key = makeRelative(link);

    key = key.replace(core.ARCHIVE_TEMPLATE_RE, "");

    var re = new RegExp(
        "(/web/[0-9]+([imjscd_/]+)?(http[s]?://[0-9a-zA-Z-_.]*" + domain + ")?)",
        "gim"
    );
    key = key.replace(re, "");

    // remove leading slashes
    key = key.replace(/^\/+/i, "");

    // remove trailing slash
    key = key.replace(/\/$/, "");

    var cdxkey = _keyLead(domain) + "/" + key;
    //debug('to cdx key: ' + cdxkey);
    return cdxkey.toLowerCase();
}


function _keyLead(domain) {
    var pd = parse_domain(domain),
        tld = pd.tld
        .split(".")
        .reverse()
        .join(",");
    return tld + "," + pd.domain + ")";
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


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

        var link = parse_domain(myURL.hostname || myURL.pathname);

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
    },
    isRestoreUrl: url => {
        if (typeof url !== "string") {
            return false;
        }

        return /^http(s)?:\/\/web\.archive\.org\/web\/[0-9]+\//.test(url);
    }
};

module.exports = {
    makeRelative: makeRelative,
    resolveHome: resolveHome,
    convertLinkToKey: convertLinkToKey,
    msToTime: msToTime,
    ...Wayback
};