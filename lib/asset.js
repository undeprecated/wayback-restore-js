/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require('debug')('asset');
var request = require('request');

// Third Party Modules
var Promise = require("bluebird");

Promise.promisifyAll(require("request"), {
    multiArgs: true
});

var ARCHIVE_TEMPLATE = "https://web.archive.org/web/";

var RESTORE_STATUS = {
    RESTORED: 'restored',
    FAILED: 'failed',
    UNARCHIVED: 'unarchived',
    RESTORING: 'restoring',
    EMPTY: null
};

function Asset() {
    this.key = null;

    // the url we restored
    this.original_url = '';

    // the path to the file content
    //this.file = config.file || '';

    this.timestamp = '';

    // restored | failed | unarchived
    this.status = RESTORE_STATUS.EMPTY;

    // archived link to restore from
    //this.snapshot = '';

    // html, image, css, js, based on wayback types
    //this.type = html;

    // restored content
    this.content = null;

    // Store more pages to restore
    this.links = {
        hrefs: [],
        assets: []
    };
}

Asset.prototype.getSnapshot = function(raw) {
    var timestamp = this.timestamp;
    var url = this.original_url;
    var flag = (raw ? 'id_' : '');

    return ARCHIVE_TEMPLATE + `${timestamp}${flag}/${url}`;
};

Asset.prototype.setTypeFromMimeType = function(mimetype) {
    this.type = convertMimeType(mimetype);
};

//Asset.prototype.clear = function() {
//    this.content = null;
//};

Asset.prototype.needsToBeRestored = function() {
    return this.status === RESTORE_STATUS.EMPTY;
};

Asset.prototype.hasBeenRestored = function() {
    return this.status === RESTORE_STATUS.RESTORED;
};

Asset.prototype.flagAsRestored = function() {
    this.status = RESTORE_STATUS.RESTORED;
};

Asset.prototype.setRestoring = function() {
    this.status = RESTORE_STATUS.RESTORING;
};

/**
 * Get the content from Waybak Machine.
 *
 * @param   {String}    url        A url to restore
 * @return  {Promise}   A Promise to return restored content.
 */
Asset.prototype.fetch = function(raw) {
    var me = this;

    return request.getAsync(this.getSnapshot(raw)).spread(function(response, body) {
        if (response.statusCode !== 200) {
            //return ;
            //    throw new Error('Unsuccessful attempt. Code: ' + response.statusCode);
        }
        //return body;
        me.content = body;
        return me;
    });
};

/**
 * Convert a CDX mimetype to a Asset type
 *
 * @private
 * @param {string} type A mimetype
 * @return {string} AssetType
 */
function convertMimeType(type) {
    if (type.match(/^text\/css/i)) {
        return css;
    } else if (type.match(/^text\//i)) {
        return text;
    } else if (type.match(/^image\//i)) {
        return image;
    } else if (type.match(/^video\//i)) {
        return video;
    } else if (type.match(/^audio\//i)) {
        return audio;
    } else if (type.match(/javascript/i)) {
        return script;
    } else {
        return other;
    }
}

module.exports = Asset;