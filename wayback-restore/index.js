// ===============================================================================
//
// References:
//
// https://github.com/heroku-examples/node-articles-nlp/tree/master/lib
//
// ===============================================================================

/*
@TODO Implement a throttle system so we don't hammer the request server
    - https://github.com/alltherooms/throttled-request
@TODO pageNotRestored handle unrestored pages. write redirect?
@TODO implement pausing a restore
@TODO implement resuming a restore
@TODO implement stopping a restore
@TODO write each restored asset to log file on restore instead of at all at end
@TODO add CLI support
*/

var restore = require( './restore' );
var cdx = require( './cdx' );
var core = require( './core' );
var parse = require( './parse' );

module.exports = {
    VERSION: core.VERSION,
    restore: restore,
    cdx: cdx,
    parse: parse.parse,
    parseDomain: parse.parseDomain,
    parseTimestamp: parse.parseTimestamp
};
