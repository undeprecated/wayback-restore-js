/*jshint node: true*/
/*global define, require, module, exports*/

/**
 * File containing different methods for handling URLs.
 */

"use strict";

var //Promise  = require("bluebird"),
    //request  = require('request'),
    path = require('path'),
    url = require('url');

//Promise.promisifyAll(require("request"), { multiArgs: true });


/**
 * Converts a URL to a local file path and name
 *
function convertToPath(url) {
    var obj = path.parse(makeRelative(url));

    var dir = obj.dir,
        filename = obj.name !== '' ? obj.name : 'index',
        suffix = obj.ext !== '' ? obj.ext : '.html';

    dir = dir.replace(/^\//, ''); // remove leading slash
    dir = dir.replace(/\/$/, ''); // remove trailing slash

    return dir + '/' + filename + suffix;
}
*/

/**
 * Fetch URL content from the internet.
 *
 * @param {string} url A URL to fetch.
 * @return {string} Result of URL.
 *
function getHtml(url) {
    return request.getAsync(url).spread(function (response, body) {
        if (response.statusCode !== 200) {
            throw new Error('Unsuccessful attempt. Code: ' + response.statusCode);
        }
        return body;
    });
}*/


/**
 * @param {string} css Content of a stylesheet
 * @return {Array} Links found
 * @private
 */
function findCssLinks(css) {
    var m,
        links = [];

    if (css) {
        var cssRe = /url\((.*)\)/igm;

        while (m = cssRe.exec(css)) {
            links.push(m[1]);
        }
    }

    return links;
}

/**
 * Find src links in HTML.
 *
 * @param {string} str A block of data
 * @return {Array} Any src links;
 * @private
 */
function findImageSrc(str) {
    var m,
        links = [];

    if (str) {
        var srcRe = /<img.*?src=['"](.*?)['"]/igm;

        while (m = srcRe.exec(str)) {
            links.push(m[1]);
        }
    }

    return links;
}

/**
 * Find links inside a block of data
 *
 * @param {string} html HTML data to search for links
 * @return {Array} Links found
 * @private
 */
function findLinks(html) {
    var m,
        links = [];

    if (html) {
        var pattern = /href\s*=\s*("[^"]*"|'[^']*'|[^'">\s]+)/igm;

        while (m = pattern.exec(html)) {
            links.push(m[1]);
        }
    }

    return links;
}

/**
 * Find /web/ archive links in HTML
 *
 * @param {string} html HTML data to search
 * @return {Array} Links found
 * @private
 */
function findArchivedLinks(html) {
    var m,
        //re = new RegExp('(\/web\/[0-9]+([imjscd_\/]+))[^\"\']*', 'gim'),
        links = [];

    if (html) {
        var pattern = /(\/web\/[0-9]+[imjscd_\/]+[^\s"']*)/igm;

        while (m = pattern.exec(html)) {
            links.push(m[1]);
        }
    }

    return links;
}

//module.exports.getHtml          = getHtml;

module.exports.findArchivedLinks = findArchivedLinks;
module.exports.findCssLinks = findCssLinks;
module.exports.findImageSrc = findImageSrc;
module.exports.findLinks = findLinks;