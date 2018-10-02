/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

'use strict';

// Core Modules
var debug = require('debug')('wayback:process');
var es = require('event-stream');
//var Promise = require('bluebird');
var util = require('util');
var EventEmitter = require('events');
var url = require('url');
var path = require('path');
//var parseDomain = require('parse-domain');

// Third-Party Modules
var fs = require('fs-extra');
var _ = require("lodash");
//var cheerio = require("cheerio");

// Local Modules
var core = require('./core');
var help = require('./helpers');
var Asset = require('./asset').Asset;
var asset = require('./asset');
var cdx = require('./cdx');
//var download = require('./download')(2);

//Promise.promisifyAll(Database);

var ARCHIVE_SOURCE = core.ARCHIVE_SOURCE;

var STATUS = core.RESTORE_STATUS;

// Events fired by Process
var EVENT = core.EVENTS;

/**
 * Base restoration project.
 */
function Process(settings) {
    EventEmitter.call(this);

    this.settings = {
        timestamp: '',
        url: '',
        domain: '',
        links: false,
        assets: true,
        directory: 'website'
    };

    _.merge(this.settings, settings);

    debug('Settings', this.settings);

    this.db = {
        cdx: new Map(),
        unrestored: {},
        restored: {}
    };
}

util.inherits(Process, EventEmitter);

Process.prototype.start = async function() {
    var me = this;

    this.emit(EVENT.STARTED);

    await this.createOutputDirectory();

    await this.fetchCdx({
        url: this.settings.domain + '*',
        filter: 'statuscode:200',
        collapse: 'timestamp:8,digest',
        to: this.settings.timestamp,
        //output: 'json'
    });

    await this.process(me.settings.url);

    this.complete();

    //log('assets', me.db.cdx.entries());

    /*
    this.fetchCdx({
            url: this.settings.domain + '*',
            filter: 'statuscode:200',
            collapse: 'timestamp:8,digest',
            to: this.settings.timestamp,
            //output: 'json'
        })
        .then(function() {
            debug(me.db.cdx.entries());
            me.process(me.settings.url);
        })
        .catch(function(err) {
            debug('fetchCdx', err);
        });*/

    //this.process(asset)
};

Process.prototype.fetchCdx = function(options, callback) {
    var me = this;

    return new Promise(function(resolve, reject) {
        cdx.stream(options)
            .on('end', function() {
                resolve(me.db.cdx);

                /*if (callback) {
                    return callback.call(me.db.cdx);
                }*/
            })
            .pipe(es.map(function(record, next) {
                record = JSON.parse(record);

                var asset = new Asset();
                asset.key = record.urlkey;
                asset.original_url = record.original;
                asset.timestamp = record.timestamp;
                asset.mimetype = record.mimetype;
                asset.domain = me.settings.domain;
                //asset.type = asset.setTypeFromMimeType(record.mimetype);

                me.db.cdx.set(asset.key, asset);
            }));
    });
};

Process.prototype.findAssetByUrl = async function(url) {
    var self = this;
    return await self.findAssetByKey(asset.convertLinkToKey(self.settings.domain, url));
};

Process.prototype.findAssetByKey = async function(key) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var asset = self.db.cdx.get(key);

        if (asset) {
            resolve(asset);
        } else {
            reject(`asset does not exist for key [${key}]`);
        }
    });
};

Process.prototype.process = async function(urls) {
    var me = this;
    var i;

    if (!Array.isArray(urls)) {
        urls = [urls];
    }

    for (i = 0; i < urls.length; i++) {
        var url = urls[i];

        debug('processing url', url);
        try {
            var asset = await me.findAssetByUrl(url);

            if (asset) {
                debug('found asset to restore for url', asset.original_url);

                if (!me.hasBeenRestored(asset)) {
                    await me.restore(asset);

                    if (me.settings.assets) {
                        debug('restoring assets');
                        await me.process(asset.assets);
                    }
                    if (me.settings.links) {
                        debug('restoring links');
                        await me.process(asset.links);
                    }
                } else {
                    debug('already restored url', asset.original_url);
                }
            }
        } catch (err) {
            debug(err);
        }


        /*
        me.findAssetByUrl(url)
            .then(function(asset) {
                debug('found asset to restore for url', asset.original_url);

                if (!me.hasBeenRestored(asset)) {
                    return me.restore(asset);
                } else {
                    debug('already restored url', asset.original_url);
                }
            })
            .then(function(asset) {
                if (me.settings.assets) {
                    debug('restoring assets');
                    me.process(asset.assets);
                }
                if (me.settings.links) {
                    debug('restoring links');
                    me.process(asset.links);
                }

                return asset;
            })
            .catch(function(err) {
                debug(err);
            });
            */
    }
};

Process.prototype.restore = async function(asset) {
    var me = this;

    me.setRestoring(asset);

    try {
        await asset.fetch(true);

        // @TODO if asset is not an HTML document, then no need
        // to do the following steps.
        //if (asset.contentType() === 'text') {
        /*
        try {
            var $ = cheerio.load(asset.content);
            asset.content = $.html();
            asset.links = me.extractLinks($);
            asset.assets = me.extractAssets($);
            asset.content = me.contentCleanup(asset.content);
        } catch (err) {
            debug(err);
            //debug('restore error: ', err);
        }
        */

        debug('save asset', asset.original_url);
        await me.saveAsset(asset);

        debug('set restored', asset.original_url);
        me.setRestored(asset);
    } catch (error) {
        me.restoreFailed(error, asset);
    }

    /*
        return asset.fetch(true)
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
                    debug(err);
                    //debug('restore error: ', err);
                }

                return asset;
            })
            .then(function(asset) {
                debug('save asset', asset.original_url);
                me.saveAsset(asset);
                return asset;
            })
            .then(function(asset) {
                debug('set restored', asset.original_url);
                me.setRestored(asset);
                return asset;
            })
            .catch(function(error) {
                me.restoreFailed(error, asset);
            });
            */
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

Process.prototype.saveAsset = async function(asset) {
    await this.saveToFile(asset.content, convertLinkToLocalFile(this.settings.domain, asset.original_url));
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

Process.prototype.setRestoring = function(asset) {
    //asset.setRestoring();
    this.db.restored[asset.key] = STATUS.RESTORING;
    this.emit(STATUS.RESTORING, asset);
    return asset;
};

Process.prototype.setRestored = function(asset) {
    //asset.setRestored();
    this.db.restored[asset.key] = STATUS.RESTORED;
    this.emit(STATUS.RESTORED, asset);
    return asset;
};

Process.prototype.hasBeenRestored = function(asset) {
    return !!this.db.restored[asset.key];
};

Process.prototype.restoreFailed = function(error, asset) {
    debug('restore failed', asset);
    //debug('snapshot', asset.getSnapshot());
    debug(error);
    //asset.setFailed();
    this.db.restored[asset.key] = STATUS.FAILD;
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
 *
Process.prototype.isCompleted = function() {
    //return this.Queue.isEmpty() && this.data.restoring <= 0;
    return this.data.restoring <= 0;
};
*/

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = async function() {
    var dir = this.settings.directory;

    try {
        await fs.emptyDir(this.settings.directory)
    } catch (err) {
        debug('Error creating output director', err);
    }
};

/**
 * Asynchronously write content to a file and makes the directory path if it
 * does not exist.
 *
 * @param  {String} content Data to write to a  file.
 * @param  {String} file    Full file and pathname.
 */
Process.prototype.saveToFile = async function(content, file) {
    var filename = this.settings.directory + '/' + file;

    filename = path.normalize(filename);

    try {
        //await fs.outputFile(filename, content, 'binary');
        await fs.outputFile(filename, content);
    } catch (err) {
        debug('Error saving to file', file, err);
    }
};

/*
Process.prototype.saveToBaseDir = function(content, file) {
    var fh = fs.createWriteStream(this.settings.directory + '/' + file);

    fh.write(content);

    fh.end();
};
Process.prototype.saveToLogDir = function(content, file) {
    this.saveToBaseDir(content, 'logs' + '/' + file);
};*/

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