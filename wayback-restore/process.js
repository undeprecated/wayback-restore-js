/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

"use strict";

// Core Modules
var debug = require("debug")("wayback:process");
var es = require("event-stream");
var util = require("util");
var EventEmitter = require("events");
var url = require("url");
var path = require("path");
var parseDomain = require("parse-domain");
var async = require("async");

// Third-Party Modules
var fs = require("fs-extra");

// Local Modules
var core = require("./core");
var help = require("./helpers");
var Asset = require("./asset");
var cdx = require("./cdx");

var RESTORE_STATUS = core.RESTORE_STATUS;

// Events fired by Process
var EVENT = core.EVENTS;

var ARCHIVE_SOURCE_RE = new RegExp(core.ARCHIVE_SOURCE, "i");
var ARCHIVE_TEMPLATE_RE = new RegExp(core.ARCHIVE_TEMPLATE, "i");

/**
 * Asset restore process.
 *
 * @TODO: Rename Process to AssetRestore
 */
function Process(settings) {
    EventEmitter.call(this);

    this.settings = settings;

    debug("Settings", this.settings);

    this.wb_re = new RegExp(
        "(/web/[0-9]+([imjscd_/]+)?(http[s]?://[0-9a-zA-Z-_.]*" +
            this.settings.domain +
            ")?)",
        "gim"
    );

    this.root_linksre = new RegExp(
        "(http(s:))?[//w.]*" + this.settings.domain,
        "ig"
    );

    this.db = {
        cdx: new Map(),
        restored: {}
    };

    /**
     * Base directory where a restore directory will be output.
     */
    this.restore_directory = path.normalize(
        help.resolveHome(this.settings.directory) + "/" + this.settings.domain
    );

    this.log_file = path.join(this.settings.directory, this.settings.logFile);

    this.results = {
        url: this.settings.url,
        domain: this.settings.domain,
        timestamp: this.settings.timestamp,
        directory: this.settings.directory,
        started: "",
        ended: "",
        runtime_hms: "",
        restored_count: 0,
        failed_count: 0,
        first_file: ""
    };
}

util.inherits(Process, EventEmitter);

//Process.prototype.onCompleted = function(results) {};

Process.prototype.start = async function() {
    this.results.started = Date.now();

    this.emit(EVENT.STARTED);

    await this.createOutputDirectory(this.restore_directory);

    await this.fetchCdx({
        url: this.settings.domain + "*",
        filter: "statuscode:200",
        collapse: "timestamp:8,digest",
        to: this.settings.timestamp
    });

    /**
     * Restores selectively based on a given URL.
     */
    this.q = async.queue((url, callback) => {
        this.restore(url, callback);
    }, this.settings.concurrency);

    this.q.drain = async () => {
        return await this.complete();
    };

    this.q.push(this.settings.url);

    /**
     * This method finds all CDX snapshots and restores based on the results.
     */
    /*
  await this.fetchCdx({
    url: this.settings.domain + "*",
    filter: "statuscode:200",
    collapse: "timestamp:8,digest",
    to: this.settings.timestamp
  });

  this.q = async.queue((asset, callback) => {
    this.restoreAsset(asset, callback);
  }, this.settings.concurrency);

  this.q.drain = async () => {
    return await this.complete();
  };

  this.db.cdx.forEach((asset, keys) => {
    this.q.push(asset);
  });
  */
    return this;
};

Process.prototype.stop = function() {
    this.q.kill();
    this.emit(EVENT.STOP);
};

Process.prototype.pause = function() {
    this.q.pause();
    this.emit(EVENT.PAUSED);
};

Process.prototype.resume = function() {
    this.q.resume();
    this.emit(EVENT.RESUMED);
};

Process.prototype.fetchCdx = function(options) {
    var me = this;

    return new Promise(function(resolve, reject) {
        cdx.stream(options)
            .on("end", function() {
                me.emit(EVENT.CDXQUERY, me.db.cdx);
                resolve(me.db.cdx);
            })
            .pipe(
                es.map(function(record, next) {
                    record = JSON.parse(record);

                    var asset = new Asset.Asset();
                    asset.key = record.urlkey;
                    asset.original_url = record.original;
                    asset.timestamp = record.timestamp;
                    //asset.domain = me.settings.domain;
                    asset.mimetype = record.mimetype;
                    asset.type = Asset.convertMimeType(record.mimetype);
                    //asset.type = asset.setTypeFromMimeType(record.mimetype);

                    me.db.cdx.set(asset.key, asset);
                })
            );
    });
};

Process.prototype.downloadFile = async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", err => {
            reject(err);
        });
        fileStream.on("finish", function() {
            resolve();
        });
    });
};

/**
 * @param {string} url - A URL to restore.
 * @param {function} callback - A callback function exected after restore.
 */
Process.prototype.restore = async function(url, callback) {
    var me = this;

    debug("processing url", url);
    try {
        var asset = await me.findAssetByUrl(url);

        if (asset) {
            debug("found asset to restore for url", asset.original_url);

            if (!me.hasBeenRestored(asset)) {
                try {
                    me.setRestoring(asset);

                    // if this is an image, stream download direct to file
                    // else get content

                    var content = await asset.fetch(true);
                    //
                    //me.downloadFile(asset.getSnapshotUrl(raw), asset.)

                    if (content) {
                        if (
                            asset.type === "text" ||
                            asset.type === "css" ||
                            asset.type === "script"
                        ) {
                            console.log(typeof content);
                            content = me.contentCleanup(content);

                            //content = content.replace(this.root_linksre, "");
                            try {
                                var $ = cheerio.load(content);

                                if (me.type === "text") {
                                    content = $.html();
                                }
                                if (me.type === "css" || me.type === "script") {
                                    content = $.text();
                                }

                                /**
                                 * This pushes assets into the restore queue
                                 */
                                if (me.settings.assets) {
                                    this.q.push([...me.extractAssets($)]);
                                }
                                /**
                                 * This pushes links we found in the asset we might need
                                 * to restore into the queue.
                                 */
                                if (me.settings.links) {
                                    this.q.push([...me.extractLinks($)]);
                                }

                                //asset.links = this.extractLinks($);
                                //asset.assets = this.extractAssets($);
                            } catch (err) {
                                debug(err);
                            }
                        }

                        if (await me.saveAsset(asset, content)) {
                            me.setRestored(asset);
                        }

                        if (me.results.first_file === "") {
                            me.results.first_file = asset.restored_file;
                        }
                    }
                    /*
                    var result = await asset.fetch(true);

                    if (result) {
                        asset.content = asset.content.replace(
                            this.root_linksre,
                            ""
                        );
                    }

                    //debug("save asset", asset.original_url);
                    await me.saveAsset(asset);

                    asset.clear();

                    //debug("set restored", asset.original_url);
                    me.setRestored(asset);

                    if (me.results.first_file === "") {
                        me.results.first_file = asset.restored_file;
                    }*/
                } catch (error) {
                    me.restoreFailed(error, asset);
                }

                // @TODO: use restoreAsset()
                /**
                 * This pushes assets into the restore queue
                 *
                if (me.settings.assets) {
                    this.q.push([...asset.assets]);
                }*/
                /**
                 * This pushes links we found in the asset we might need
                 * to restore into the queue.
                 *
                if (me.settings.links) {
                    this.q.push([...asset.links]);
                }*/
            } else {
                debug("already restored url", asset.original_url);
            }
        }
    } catch (err) {
        debug(err);
    }

    return callback(asset);
};

/**
 * Remove extraneous code from the restored content and cleanup links.
 */
Process.prototype.contentCleanup = function(content) {
    /**
     * makes http://domain-to-restore.com links relative
     */
    content = content.replace(this.root_linksre, "");

    content = content.replace(this.wb_re, "");
    content = content.replace(ARCHIVE_TEMPLATE_RE, "");
    //content = content.replace(/(https?:)?\/\/web.archive.org/gi, "");
    //content = content.replace(/(https?:)?\/\/web.archive.org/gi, "");

    return content;
};

Process.prototype.findAssetByUrl = async function(url) {
    var self = this;
    return await self.findAssetByKey(
        convertLinkToKey(self.settings.domain, url)
    );
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

/**
 * Restore process has completed.
 */
Process.prototype.complete = async function() {
    var me = this;

    me.results.ended = Date.now();

    if (me.settings.log) {
        try {
            await fs.outputFile(
                this.log_file,
                JSON.stringify(me.getLogData(), null, 2)
            );
        } catch (err) {
            debug("Error saving log file", this.log_file, err);
        }
    }

    me.results.runtime_hms = msToTime(me.results.ended - me.results.started);

    me.emit(EVENT.COMPLETED, me.results);

    //me.onCompleted(me.results);
};

Process.prototype.saveAsset = async function(asset, content) {
    var url = this.cleanupWaybackUrl(asset.original_url);

    asset.restored_file = this.convertToLocalFilePath(url);

    try {
        await fs.outputFile(
            path.join(this.restore_directory, asset.restored_file),
            content
            //asset.content
        );
    } catch (err) {
        debug("Error saving to file", file, err);
        return false;
    }
    return true;
};

Process.prototype.setRestoring = function(asset) {
    asset.setRestoring();
    this.db.restored[asset.key] = RESTORE_STATUS.RESTORING;
    this.emit(RESTORE_STATUS.RESTORING, asset);
    return asset;
};

Process.prototype.setRestored = function(asset) {
    asset.setRestored();
    this.db.restored[asset.key] = RESTORE_STATUS.RESTORED;
    this.results.restored_count++;
    this.emit(RESTORE_STATUS.RESTORED, asset);
    return asset;
};

Process.prototype.restoreFailed = function(error, asset) {
    debug("restore failed", asset);
    debug(error);
    asset.setFailed();
    this.results.failed_count++;
    this.db.restored[asset.key] = RESTORE_STATUS.FAILD;
    this.emit(RESTORE_STATUS.FAILED, asset);
};

Process.prototype.hasBeenRestored = function(asset) {
    return !!this.db.restored[asset.key];
};

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = async function(dir) {
    try {
        await fs.emptyDir(dir);
    } catch (err) {
        debug("Error creating output directory", err);
    }
};

Process.prototype.getLogData = function(filename) {
    var self = this;
    var log = {};

    for (var [key, asset] of self.db.cdx.entries()) {
        if (!log.hasOwnProperty(asset.status)) {
            log[asset.status] = [];
        }
        log[asset.status].push(asset);
    }

    return log;
};

/**
 * Clean up a URL by removing the wayback machine snapshot information.
 */
Process.prototype.cleanupWaybackUrl = function(link) {
    var url = link;

    url = url.replace(ARCHIVE_SOURCE_RE, "");

    url = url.replace(this.wb_re, "");

    // remove leading slashes
    url = url.replace(/^\/+/i, "");

    return url;
};

/**
 * Converts a URL to a local file path and name
 */
Process.prototype.convertToLocalFilePath = function(url) {
    var obj = path.parse(help.makeRelative(url));

    var dir = obj.dir;
    var filename = obj.name !== "" ? obj.name : "index";
    var suffix = obj.ext !== "" ? obj.ext : ".html";

    dir = dir.replace(/^\//, ""); // remove leading slash
    dir = dir.replace(/\/$/, ""); // remove trailing slash

    return path.join(dir, filename + suffix);
};

function convertLinkToKey(domain, link) {
    var key = help.makeRelative(link);

    key = key.replace(ARCHIVE_TEMPLATE_RE, "");

    var re = new RegExp(
        "(/web/[0-9]+([imjscd_/]+)?(http[s]?://[0-9a-zA-Z-_.]*" +
            domain +
            ")?)",
        "gim"
    );
    key = key.replace(re, "");

    // remove leading slashes
    key = key.replace(/^\/+/i, "");

    // remove trailing slash
    key = key.replace(/\/$/, "");

    var cdxkey = _keyLead(domain) + "/" + key;
    //debug('to cdx key: ' + cdxkey);
    return cdxkey.toLowerCase();
}

function _keyLead(domain) {
    var pd = parseDomain(domain),
        tld = pd.tld
            .split(".")
            .reverse()
            .join(",");
    return tld + "," + pd.domain + ")";
}

function filter(link) {
    // filter links
    if (
        !(
            /^javascript/i.test(link) ||
            /^mailto/i.test(link) ||
            ///^http/i.test(link) ||
            /^#/.test(link) ||
            /^\?/.test(link) ||
            /^\/\//i.test(link)
        )
    ) {
        return link;
    }
    return;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

module.exports = {
    Process: Process,
    convertLinkToKey: convertLinkToKey
};
