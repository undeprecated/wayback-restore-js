/* jshint node: true */
/*global define, require, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, spyOn*/

"use string";

var debug = require( "debug" )( "wayback:main" );
var Wayback = require( "../dist/wayback-restore" );

/*

var restore = Wayback.restore({
    directory: "test/restores/cashpropertysolutions.co.uk",
    url:
        "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
});

var restore = Wayback.restore({
    domain: 'cashpropertysolutions.co.uk',
    timestamp: "20150531"
});

const domain = Wayback.parseDomain('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk')
const timestamp = Wayback.parseTimestamp('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk')
const {domain, timestamp} = Wayback.parse('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk')
*/
//var restore = Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');
console.log( Wayback );

var restore = Wayback.restore( {
    directory: "test/restores/cashpropertysolutions.co.uk", url: "http://www.cashpropertysolutions.co.uk/",
    //domain: 'cashpropertysolutions.co.uk',
    timestamp: "20150531",
    links: true,
    log: true
} );
restore.start();
/*restore.onCompleted( function ( results ) {
    console.log( results );
} );*/
restore.on( "completed", function () {
    console.log( "restorationg has completed" );
    //console.log(this);
    //console.log(this.getLog());
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
