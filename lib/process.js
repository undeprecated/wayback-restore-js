/*jshint node: true*/
/*global define, require, module*/

'use strict';

// Core Modules
var fs = require('fs');
var es = require('event-stream');
var Promise = require('bluebird');
var util = require('util');
var EventEmitter = require('events');
var url = require('url');
var debug = require('debug')('process');
var path = require('path');
var mkdirp = require('mkdirp');
//var parseDomain = require('parse-domain');

// Third-Party Modules
var cheerio = require("cheerio");

// Local Modules
var help = require('./helpers');
var Asset = require('./asset');

//Promise.promisifyAll(Database);

var ARCHIVE_SOURCE = 'http://web.archive.org';
//var ARCHIVE_TEMPLATE = 'http://web.archive.org/web/%s';

var STATUS = {
    RESTORED: 'restored',
    FAILED: 'failed',
    RESTORING: 'restoring'
};

// Events fired by Process
var EVENT = {
    STARTED: 'start',
    RESTORING: 'restoring',
    RESTORED: 'restored',
    COMPLETED: 'completed'
};

/**
 * Base restoration project.
 */
function Process(settings) {
    EventEmitter.call(this);

    this.settings = {
        timestamp: settings.timestamp,
        url: settings.url,

        domain: settings.domain,

        recurse: settings.recurse,
        directory: settings.directory
    };

    debug('Settings');
    debug(this.settings);

    this.db = {
        cdx: [],
        unrestored: {},
        restored: {}
    };

    this.data = {
        restoring: 0, // counter for number of restores in progress
        restored: 0, // number of links restored
        unrestored: 0, // number of links not restored
        start_dt: ''
    };
}

util.inherits(Process, EventEmitter);

Process.prototype.start = function() {
    var asset = new Asset();

    asset.original_url = this.settings.url;
    asset.timestamp = this.settings.timestamp;

    this.process(asset);

    this.emit(EVENT.STARTED);
};

Process.prototype.process = function(assets) {
    var me = this;

    if (!Array.isArray(assets)) {
        assets = [assets];
    }

    for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        //var urlToRestore = asset.getSnapshot();
        //var link = url.resolve(ARCHIVE_SOURCE, urlToRestore);

        //if (me.hasBeenProcessed(asset)) {
        if (asset.needsToBeRestored()) {
            me.restore(asset);
        }
    }
};

Process.prototype.restore = function(asset) {
    var me = this;

    me.setRestoring(asset);

    //download(asset.getSnapshot())

    asset.fetch(true)
        .then(function(asset) {
            var $;

            // @TODO if asset is not an HTML document, then no need
            // to do the following steps.
            try {
                $ = cheerio.load(asset.content);
                asset.content = $.html();
                asset.links = me.extractLinks($);
                asset.assets = me.extractAssets($);
                asset.content = me.contentCleanup(asset.content);
            } catch (err) {
                //debug('restore error: ', err);
            }
            //})
            //.then()
            //me.saveToFileDir(asset.content, convertLinkToLocalFile(me.settings.domain, asset.original_url));

            /*
            if (asset.assets.length) {
                me.restore(asset.assets);
            }

            if (me.settings.recurse && asset.links.length) {
                me.restore(asset.links);
            }*/

            return asset;
        })
        .then(function(asset) {
            me.saveAsset(asset);
            return asset;
        })
        //.then(me.restoreAssets)
        //.then(me.restoreLinks)
        .then(function(asset) {
            me.setRestored(asset);
            return asset;
        })
        .catch(function(error) {
            debug('restore', error);
        });
};

/**
 * Restore process has completed.
 */
Process.prototype.complete = function() {
    var me = this;
    // Create the Manifest
    //this.Manifest.set('started', this.data.start_dt);
    //this.Manifest.set('ended', Date.now());
    //console.log(this.base_dir + '/' + this.Manifest.get('name'));
    //this.Manifest.save(this.base_dir + '/' + this.Manifest.get('name'));

    me.end_dt = Date.now();

    // wait a second for Node's event loop to finish before firing event.
    // somewhat ensures this event is fired last.
    setTimeout(function() {
        me.emit('completed');
    }, 1000);
};

Process.prototype.saveAsset = function(asset) {
    this.saveToFileDir(asset.content, convertLinkToLocalFile(this.settings.domain, asset.original_url));
    return asset;
};

/**
 * Extract the links to assets ie images, CSS, JS
 *
 * @param page {RestorePage} The object to find more links to restore.
 * @return {Array}  Links found
 */
Process.prototype.extractAssets = function($) {
    var links = [];

    $('[src], link[href]').each(function(index, link) {
        var src = $(link).attr('src');

        if (src) {
            links.push(src);
            $(link).attr('src', help.makeRelative(src));
        }

        var href = $(link).attr('href');
        if (href) {
            links.push(href);
            $(link).attr('href', help.makeRelative(href));
        }
    });

    return links;
};

Process.prototype.extractLinks = function($) {
    var restore = this,
        domain = this.settings.domain,
        links = [];

    // get all hrefs
    $('a[href]').each(function(index, a) {
        var href = $(a).attr('href');

        /*
        // remove archive
        href = rewriteLink(domain, href);

        var re = new RegExp("^(http[s:])?[//w.]*" + domain, "i");
        if (re.test(href)) {
            href = Url.makeRelative(href);
        }*/

        if (filter(href)) {
            links.push(href);
        }
    });

    return links;
};

/**
 * Remove extraneous code from the restored content and cleanup links.
 */
Process.prototype.contentCleanup = function(content) {
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.settings.domain})?)/gim, '');

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, '');

    return content;
};

/*
Process.prototype.hasBeenProcessed = function(link) {
    return this.db.restored.hasOwnProperty(link);
};
*/

Process.prototype.setRestoring = function(asset) {
    debug('restoring: ', asset);
    asset.setRestoring();
    this.db.restored[asset.key] = STATUS.RESTORING;
    this.emit(STATUS.RESTORING, asset);
    return asset;
};

Process.prototype.setRestored = function(asset) {
    debug('set restored', asset.original_url);
    this.db.restored[asset.key] = STATUS.RESTORED;
    this.emit(STATUS.RESTORED, asset);
    return asset;
};

Process.prototype.restoreFailed = function(asset) {
    this.emit(STATUS.FAILED, asset);
};

/*
Process.prototype.linkHasBeenRestored = function(link) {
    var me = this;
    //key = Cdx.convertLinkToCdxKey(me.domain, link);

    return me.db.restored.hasOwnProperty(link) && me.db.restored[link] === STATUS.RESTORED;
};

Process.prototype.linkHasNotBeenRestored = function(link) {
    var me = this;
    //key = Cdx.convertLinkToCdxKey(me.domain, link);

    return me.db.unrestored.hasOwnProperty(link);
};
*/

// Load me from database
//Process.prototype.load = function() {
//this.db.load();
//};

//Process.prototype.emptyDb = function(callback) {
//    this.db.cdx = {};
/*
this.db.cdx.db.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) {
        return callback(err);
    }
    return callback(null, numRemoved);
}); */
//};

// Performs a CDX query
/*
Project.prototype.findArchived = function (options, callback) {
    var project = this;

    //this.cdx = new CdxQuery.CdxQuery(project.domain, options);
    //this.cdx.query(callback);

    return Cdx.query(project.domain, options, function(records) {
        project.db.cdx = records;
        return callback(null);
    });
};
*/

/*
Process.prototype.checkCompletion = function() {
    if (this.isCompleted()) {
        this.complete();
    }
};*/

/**
 * Restore process has fully completed when nothing is in the Queue
 * and nothing else is being restored.
 */
Process.prototype.isCompleted = function() {
    //return this.Queue.isEmpty() && this.data.restoring <= 0;
    return this.data.restoring <= 0;
};

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = function() {
    var dir = this.settings.directory;

    mkdirp.sync(dir);
};

/**
 * Asynchronously write content to a file and makes the directory path if it
 * does not exist.
 *
 * @param  {String} content Data to write to a  file.
 * @param  {String} file    Full file and pathname.
 */
Process.prototype.saveToFileDir = function(content, file) {
    var filename = this.settings.directory + '/' + file;

    filename = path.normalize(filename);

    mkdirp(path.dirname(filename), function(err) {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile(filename, content, 'binary', function(err) {
                if (err) throw err;
                // The file has been saved
            });
        }
    });
};

Process.prototype.saveToBaseDir = function(content, file) {
    var fh = fs.createWriteStream(this.settings.directory + '/' + file);

    fh.write(content);

    fh.end();
};

Process.prototype.saveToLogDir = function(content, file) {
    this.saveToBaseDir(content, 'logs' + '/' + file);
};

function convertLinkToKey(domain, link) {

}

function convertLinkToLocalFile(domain, link) {
    var file;
    var key = link;
    //var key = Url.makeRelative(link);

    // @TODO - move this to constructor? doesn't need to be called every time
    var re = new RegExp(ARCHIVE_SOURCE, "i");

    key = key.replace(re, '');

    re = new RegExp('(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*' + domain + ')?)', 'gim');
    key = key.replace(re, '');

    // remove leading slashes
    key = key.replace(/^\/+/i, '');

    file = help.convertToPath(key);

    debug('convert link to localfile: ', link, file);
    return file;
}

function filter(link) {
    // filter links
    if (!(/^javascript/i.test(link) ||
            /^mailto/i.test(link) ||
            ///^http/i.test(link) ||
            /^#/.test(link) ||
            /^\?/.test(link) ||
            /^\/\//i.test(link))) {
        return link;
    }
    return;
}

module.exports = Process;