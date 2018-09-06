/*jshint node: true*/
/*global define, require, module*/

'use strict';

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var PageTypes = require("./Types");

function Page(config) {
    this.data = {
        // reference/key to a CDX record
        //key: null,

        // the url we restored
        url: '',

        // the path to the file content
        //file: '',

        // restored | failed | unarchived
        status: null,

        // archived link to restore from
        archive: '',

        // html, image, css, js, based on wayback types
        type: 'html',

        // restored content
        content: null,

        // Store more pages to restore
        links: null
    };
}

//Page.prototype.data = {};

Page.prototype.get = function (name) {
    return this.data[name];
};

Page.prototype.set = function (name, value) {
    this.data[name] = value;
};

Page.prototype.setTypeFromMimeType = function (mimetype) {
    this.set('type', PageTypes.convertMimeType(mimetype));
};

Page.prototype.hasBeenRestored = function () {
    return this.get('file') === '' ? false : true;
};

Page.prototype.clearContent = function () {
    this.set('content', null);
};

/* @TODO Read the restored content from file
Page.prototype.readContent = function () {
    if (this.file && this.file !== '') {
        this.set('content', readFile(this.file));
    }
};
*/

module.exports = Page;
