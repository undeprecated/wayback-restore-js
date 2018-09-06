/*jshint esversion: 6*/
/*global define, require, module */

// Core Modules
//var util = require('util');
//var url = require('url');
//parseDomain = require('parse-domain'),
var debug = require('debug')('restore');

// Third Party Modules
//var request = require('request');
//var Promise = require("bluebird");

//uniq = require('lodash/uniq'),
//throttledRequest    = require('throttled-request')(request),
//var EventEmitter = require('events');
//var util = require('util');

// Local Modules
var Process = require('./process');
var helper = require('./helpers');

//var Redirects = require('./Redirects');
//var Url = require('./Url');
//var Removals = require('./Removals');
//var Url = require('./Url');

// Constants
//var ARCHIVE_TEMPLATE = 'http://web.archive.org/';
//var ARCHIVE_URL = ARCHIVE_TEMPLATE + '${timestamp}${flag}/${url}';

//Promise.promisifyAll(require("request"), {
//    multiArgs: true
//});

/**
 * @constructor
 *
 * @params    {RestoreOptions}    Options for restoration.
 */
//function Restore() {
//EventEmitter.call(this);

//this.options.domain = this.parseDomainToRestore(this.options.restoreUrl);

//debug('domain to restore: ' + this.options.domain);
// Available Event Handling
//this.initEvents();
//}

//util.inherits(Restore, EventEmitter);

//Restore.prototype.initEvents = function() {};

/**
 * This is the main restore process of a Wayback Machine archive.
 *
 * @param  {[type]} url  An archive url to restore.
 * @return {[type]}      [description]
 */
function restore(settings) {
    if (settings.url) {
        return restoreUrl(settings.url, settings);
    }
    if (settings.domain) {
        return restoreDomain(settings.domain, settings);
    }
}

function restoreDomain(domain, settings) {
    settings.domain = domain;
    settings.url = settings.url = `http://${settings.domain}`;
    return createProcess(settings);
}

function restoreUrl(url, settings) {
    settings.url = url;
    return createProcess(settings);
}

function createProcess(settings) {
    settings.domain = helper.parseDomainToRestore(settings.url);
    return new Process(settings);
}
/*
Restore.prototype.restore = function(url) {
    var restore = this;
    var success = false;

    //restore.emit('restoring', url);

    return restore.getContent(url)
        .then(function(content) {
            if (!content) {
                return restore.failed(url);
            }

            content = restore.removeWaybackInserts(content);
            content = restore.removeOtherInserts(content);
            //content = restore.contentCleanup(content);

            return restore.completed(url, content);
        })
        .catch(function(error) {
            return restore.failed(url);
        });
};

Restore.prototype.completed = function(url, content, success) {
    //this.emit('success', url, content);
    return {
        url: url,
        content: content
    };
};

Restore.prototype.failed = function(url) {
    //this.emit('failed', url);
    return {
        url: url,
        content: null,
        success: false
    };
};
*/
/**
 * Get the content for a RestorePage object.
 *
 * @param   {String}    url        A url to restore
 * @return  {Promise}   A Promise to return restored content.
 */
/*
Restore.prototype.getContent = function(url) {
    return request.getAsync(url).spread(function(response, body) {
        if (response.statusCode !== 200) {
            return '';
            //    throw new Error('Unsuccessful attempt. Code: ' + response.statusCode);
        }
        return body;
    });
};
*/

//Restore.prototype.removeWaybackInserts = function(content) {
//    return Removals.waybackInserts(content);
//};

//Restore.prototype.removeOtherInserts = function(content) {
//    return Removals.other(content);
//};

/**
 * Remove extraneous code from the restored content and cleanup links.
 *
Restore.prototype.contentCleanup = function(content) {
    //content = Removals.waybackInserts(content);
    //content = Removals.other(content);
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, '');

    return content;
};
*/

// @TODO implement redirect
/*
Restore.prototype.writeRedirect = function(url, file) {
    var redirect = '',
        obj = path.parse(file);

    if (this.options.redirect.type === 'htaccess') {
        redirect = Redirects.htaccess(url, this.options.redirect.to);
        this.saveToFileDir(redirect, obj.dir + '/.htacces');
    } else if (this.options.redirect.type === 'php') {
        redirect = Redirects.php(this.options.redirect.to);
        this.saveToFileDir(redirect, obj.dir + '/index.php');
    }
};
*/

module.exports = restore;