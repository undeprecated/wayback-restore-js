/* jshint node:true */
/* global define, require, module */

"use strict";

var url = require( 'url' );

var debug = require( 'debug' )( 'wayback:helpers' );

/**
 * Convert a URL to relative path by removing the hostname.
 *
 * @param {string} str A URL.
 * @return {string} A relative URL.
 */
function makeRelative( str ) {
    var nstr = url.parse( str );

    if ( nstr.path ) {
        nstr = nstr.path.replace( /^\/+/i, '' );
    }

    nstr = '/' + nstr;

    return nstr;
}

module.exports = {
    makeRelative: makeRelative
};
