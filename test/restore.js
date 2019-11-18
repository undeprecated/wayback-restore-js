/* jshint node: true */
/*global define, require, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, spyOn*/

"use string";

var debug = require( "debug" )( "wayback:main" );
//var Wayback = require( "../dist/wayback-restore" );
var Wayback = require( "../wayback-restore" );

/*
var restore = Wayback.restore({
    url:
        "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
});

var restore = Wayback.restore({
    domain: 'cashpropertysolutions.co.uk',
    timestamp: "20150531"
});

var restore = Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');
*/

var restore = Wayback.restore( { directory: "~/testrestore/restores/", domain: "cashpropertysolutions.co.uk", timestamp: "20150531", links: true, log: true } );
restore.start();
restore.on( "completed", function ( results ) {
    console.log( "restorationg has completed" );
    console.log( "url: ", results.url );
    console.log( "directory: ", results.directory );
    console.log( "first file: ", results.first_file );
    console.log( 'started: ', results.start_dt );
    console.log( 'ended: ', results.end_dt );
    console.log( 'restored: ', results.restored_count );
    console.log( 'failed: ', results.failed_count );
} );
/*
    .on('start', function() {
        console.log('[STARTED USING]:', this.settings);
    })
    .on('cdxquery', function(cdx) {
        console.log('[CDX RECORDS]', cdx);
    })
    .on('restoring', function(Asset) {
        console.log('[RESTORING]', Asset);
    })
    .on('restored', function(Asset) {
        console.log('[RESTORED]', Asset.original_url);
    })
    .on('failed', function(Asset) {
        console.log('[NOT RESTORED]', Asset.original_url);
    })
    .on('completed', function() {
        console.log('[COMPLETED]');
    })*/
