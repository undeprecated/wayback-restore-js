/*global define, require, module */

"use strict";

var path = require('path');
var url = require('url');
var parseDomain = require('parse-domain');
var debug = require('debug')('helpers');

// @TODO: move to constants file
var ARCHIVE_SOURCE = 'http://web.archive.org';


function parseDomainToRestore(href) {
    //var domain = href.replace(ARCHIVE_SOURCE, '');

    var myURL = url.parse(href);

    var matches = myURL.pathname.match(/http.*/gi);

    if (matches) {
        var link = parseDomain(url.parse(matches[0]).hostname);

        if (link) {
            return link.domain + '.' + link.tld;
        }
    }

    debug('Could not extract an archived link');
    return;
}

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

/**
 * Converts a URL to a local file path and name
 */
function convertToPath(url) {
    var obj = path.parse(makeRelative(url));

    var dir = obj.dir,
        filename = obj.name !== '' ? obj.name : 'index',
        suffix = obj.ext !== '' ? obj.ext : '.html';

    dir = dir.replace(/^\//, ''); // remove leading slash
    dir = dir.replace(/\/$/, ''); // remove trailing slash

    return dir + '/' + filename + suffix;
}

module.exports.parseDomainToRestore = parseDomainToRestore;
module.exports.makeRelative = makeRelative;
module.exports.convertToPath = convertToPath;