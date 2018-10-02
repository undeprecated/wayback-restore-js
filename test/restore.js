/*jshint node: true*/
/*global define, require, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, spyOn*/

'use string';

var debug = require('debug')('wayback:main');
var Wayback = require("../");

var restore = Wayback.restore({
    directory: 'test/restores/cashpropertysolutions.co.uk',
    url: 'http://www.cashpropertysolutions.co.uk/',
    //domain: 'cashpropertysolutions.co.uk',
    timestamp: '20150531',
    links: true
});
restore.start();
restore.on('completed', function() {
    console.log('restorationg has completed');
});

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