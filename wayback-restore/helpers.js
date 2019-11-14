/* jshint node:true */
/* global define, require, module */

"use strict";

var os = require( 'os' );
var url = require( 'url' );
var path = require( 'path' );

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

function resolveHome( filepath ) {
    if ( filepath[ 0 ] === '~' ) {
        return path.join( os.homedir(), filepath.slice( 1 ) );
    } else {
        return filepath;
    }
}

module.exports = {
    makeRelative: makeRelative,
    resolveHome: resolveHome
};
