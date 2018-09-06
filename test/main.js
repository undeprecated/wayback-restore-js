/*jshint node: true*/
/*global define, require, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, spyOn*/

'use string';

var Wayback = require("../");

var restore = Wayback.restore({
        directory: 'files',
        url: 'http://www.cashpropertysolutions.co.uk/',
        //domain: 'cashpropertysolutions.co.uk',
        timestamp: '20150531',
        links: false
    })
    .on('start', function() {
        console.log('[STARTED USING]:', this.settings);
    })
    .on('restoring', function(Asset) {
        console.log('[RESTORING]', Asset);
    })
    .on('restored', function(Asset) {
        console.log('[RESTORED]', Asset);
    })
    .on('failed', function(Asset) {
        console.log('[NOT RESTORED]', Asset);
    })
    .on('completed', function() {
        console.log('[COMPLETED]');
        //console.log('Restored: ' + this.data.restored);
        //console.log('Unrestored: ' + this.data.unrestored);
    })
    .start();