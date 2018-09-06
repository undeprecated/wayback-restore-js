/*jshint node: true*/
/*global define, require, module */

/**
 * Module for removing code from an HTML page.
 */
'use strict';

var WaybackInserts = init([
    '<script type="text/javascript" src="/static/js/ait-client-rewrite.js"></script>',
    '<script type="text\/javascript" src="\/static\/js\/analytics.js"><\/script>',
    '<script type="text\/javascript">archive_analytics.values.server_name=".*.archive.org.*<\/script>?',
    '<link type="text\/css" rel="stylesheet" href="\/static\/css\/banner-styles.css"\/>',
    '<!-- BEGIN WAYBACK TOOLBAR INSERT -->[\\s\\n\\S.*]+<!-- END WAYBACK TOOLBAR INSERT -->',
    '<!--[\\s]+FILE ARCHIVED[\\s\\S]+-->',
    "<script type=\"text/javascript\">[\\s\\n\\S.*]+__wbhack.init('/web');[\\s\\n\\S.*]+ </script>",
], "gim");

var Others = init([
    '<\!-- ValueClick Media.*-->[\s\S]*?<\!-- ValueClick Media.*-->',
    '<\!-- FASTCLICK.COM.*-->[\s\S]*?<\!-- FASTCLICK.COM.*-->'
], "gim");

/**
 * Remove Google Analytic tracking code.
 *
 * @param {string} html HTML page
 * @return {string} HTML without Google Analytic script tags
 */
function googleAnalytics(html) {
    // remove the script tag that inserts ga.js
    html = html.replace(/<[\s]*script[^>]*>[\s\S][^<]*?google-analytics.com\/ga\.js[\s\S]*?<[\s\/]+script[\s]*>/img, '');

    // remove the _getTracker("UA-xxxxxx") script
    html = html.replace(/<[\s]*script[^>]*>[\s\S][^<]*?_getTracker\("UA[-a-zA-Z0-9]*?"\)[\s\S]*?<[\s\/]+script[\s]*>/img, '');

    return html;
}

/**
 * Remove the code inserted by the wayback machine.
 *
 * @param {string} html HTML page
 * @return {string} HTML without the Wayback machine code
 */
function waybackInserts(html) {
    return replace(WaybackInserts, html);
}

/**
 * Remove other garbage.
 *
 * @param {string} html HTML page
 * @return {string} HTML without the Wayback machine code
 */
function other(html) {
    return replace(Others, html);
}

/**
 * Convert array of patterns into Regular Expressions.
 *
 * @param {Array} arr An array of patterns.
 * @param {String} flags A set of RegExp flags to use
 */
function init(arr, flags) {
    var i;

    for (i = 0; i < arr.length; i++) {
        arr[i] = new RegExp(arr[i], flags);
    }

    return arr;
}

/**
 * Convience method for looping over an array of RegExp
 *
 * @param {Array} arr Array of Regular Expressions
 * @param {string} html The content of which to do the replacing
 */
function replace(arr, html) {
    var i;

    for (i = 0; i < arr.length; i++) {
        html = html.replace(arr[i], '');
    }

    return html;
}


module.exports.googleAnalytics = googleAnalytics;
module.exports.waybackInserts = waybackInserts;
module.exports.other = other;