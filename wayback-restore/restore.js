/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

'use strict';

// Core Modules
var debug = require('debug')('wayback:restore');
var es = require('event-stream');
var util = require('util');
var EventEmitter = require('events');
var path = require('path');
var async = require('async');

// Third-Party Modules
var fs = require('fs-extra');
var Fs = require('fs');
var cheerio = require('cheerio');
var mime = require('mime-types');

// Local Modules
var core = require('./core');
var utils = require('./utils');
//var parse = require("./parse");
var Asset = require('./asset');
var CdxQuery = require('./cdx/query');

var RESTORE_STATUS = core.RESTORE_STATUS;

// Events fired by Process
var EVENT = core.EVENTS;

/**
 * Download process.
 */
function Process(settings) {
  EventEmitter.call(this);

  const defaults = {
    timestamp: '',
    url: '',
    domain: '',
    directory: 'restore', // base directory
    max_pages: null, // leave empty for null
    links: true, // restore links
    assets: true, // restore assets
    concurrency: 1,
    log: false,
    logFile: 'restore.log'
  };

  if (typeof settings === 'string') {
    let url = settings;
    settings = {};
    settings.url = url;
  }

  this.settings = Object.assign(defaults, settings);

  if (this.settings.url !== '') {
    const { domain, timestamp } = utils.parse(this.settings.url);
    this.settings.domain = domain;
    this.settings.timestamp = timestamp;
  } else if (this.settings.domain !== '' && this.settings.timestamp !== '') {
    this.settings.url = `https://web.archive.org/web/${this.settings.timestamp}/http://${this.settings.domain}`;
  } else {
    throw 'Invalid settings';
  }

  debug('Settings', this.settings);

  this.wb_re = new RegExp(
    '(/web/[0-9]+([imjscd_/]+)?(http[s]?://[0-9a-zA-Z-_.]*' + this.settings.domain + ')?)',
    'gim'
  );

  this.root_linksre = new RegExp('(http(s:))?[//w.]*' + this.settings.domain, 'ig');

  this.db = {
    cdx: new Map(),
    restored: {}
  };

  this.cdxQuery = new CdxQuery({
    url: this.settings.domain + '*',
    filter: 'statuscode:200',
    collapse: 'timestamp:8,digest',
    to: utils.timestampToDay(this.settings.timestamp)
  });

  /**
   * Base directory where a restore directory will be output.
   */
  this.restore_directory = path.normalize(
    utils.resolveHome(this.settings.directory) + '/' + this.settings.domain
  );

  this.log_file = path.join(this.settings.directory, this.settings.logFile);

  this.results = {
    url: this.settings.url,
    domain: this.settings.domain,
    timestamp: this.settings.timestamp,
    directory: this.restore_directory,
    started: '',
    ended: '',
    runtime_hms: '',
    restored_count: 0,
    failed_count: 0
  };
}

util.inherits(Process, EventEmitter);

//Process.prototype.onCompleted = function(results) {};

Process.prototype.stop = function () {
  this.q.kill();
  this.emit(EVENT.STOP);
  return this;
};

Process.prototype.pause = function () {
  this.q.pause();
  this.emit(EVENT.PAUSED);
  return this;
};

Process.prototype.resume = function () {
  this.q.resume();
  this.emit(EVENT.RESUMED);
  return this;
};

Process.prototype.start = async function () {
  this.results.started = Date.now();

  this.emit(EVENT.STARTED, this.results.started);

  await this.createOutputDirectory(this.restore_directory);

  try {
    await this.fetchCdx();
  } catch (e) {
    this.emit(EVENTS.ERROR, e);
  }

  /**
   * Sets up our restore queue.
   */
  this.q = async.queue(async (asset, callback) => {
    // If we don't await, then the queue drain event fires before restore finishes
    await this.restoreHandler(asset);
    callback();
  }, this.settings.concurrency);

  this.q.drain = async () => {
    return await this.complete();
  };

  //this.q.push(this.settings.url);
  var asset = this.findAssetByUrl(this.settings.url);

  this.q.push(asset);

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

Process.prototype.fetchCdx = async function () {
  return new Promise((resolve, reject) => {
    this.cdxQuery
      .stream()
      .on('end', () => {
        this.emit(EVENT.CDXQUERY, this.db.cdx);
        resolve(this.db.cdx);
      })
      .pipe(
        es.map((record, next) => {
          record = JSON.parse(record);

          var asset = new Asset.Asset();
          asset.key = record.urlkey;
          asset.original_url = record.original;
          asset.timestamp = record.timestamp;
          //asset.domain = this.settings.domain;
          asset.mimetype = record.mimetype;
          asset.type = Asset.convertMimeType(record.mimetype);
          //asset.type = asset.setTypeFromMimeType(record.mimetype);

          this.db.cdx.set(asset.key, asset);
          next(null, asset);
        })
      );
  });
};

/**
 * Called whenever we add to the queue.
 *
 * @param {Asset} asset - An Asset record.
 * @param {function} callback - A callback function exected after restore.
 */
Process.prototype.restoreHandler = async function (asset) {
  /**
   * If asset has not been restored.
   */
  if (asset.restored_file === '' && asset.status === '') {
    var restored = await this.restoreAsset(asset);

    if (this.maxPagesReached()) {
      this.stop();
      this.complete();
    }

    if (restored) {
      /**
       * These asset types could have links to other archived sources.
       * Lets read the content and find additional links to restore.
       */
      if (
        ['text', 'css', 'script'].includes(asset.type) &&
        (this.settings.assets || this.settings.links)
      ) {
        var content = await Fs.promises.readFile(asset.restored_file);
        var $ = cheerio.load(content);

        //if (asset.type === "text") {
        //    content = $.html();
        //}
        //if (asset.type === "css" || asset.type === "script") {
        //    content = $.text();
        //}

        //content = this.contentCleanup(content);

        /**
         * We restored something.
         * Write the content to a local file.
         */
        //await fs.outputFile(local_file, content);
        //asset.restored_file = local_file;
        //restored = true;

        /**
         * Restore assets in the content?
         */
        if (this.settings.assets) {
          var assets_to_restore = this.findToRestore(asset.extractAssets($));

          this.q.push([...Array.from(assets_to_restore.values())]);
        }
        /**
         * Restore links to other pages in the content?
         */
        if (this.settings.links) {
          var links_to_restore = this.findToRestore(asset.extractLinks($));

          this.q.push([...Array.from(links_to_restore.values())]);
        }
      }
    }
  }
};

Process.prototype.restoreAsset = async function (asset) {
  var local_file = path.join(
    this.restore_directory,
    this.convertToLocalFilePath(asset.original_url, mime.extension(asset.mimetype))
  );

  this.setRestoring(asset);

  try {
    await asset.download(local_file);
    this.setRestored(asset);
    return true;
  } catch (error) {
    debug(error);
    this.restoreFailed(error, asset);
    return false;
  }
};

/**
 * Takes an array of URLs and tries to find a matching Asset.
 *
 * @param  {Array} urls - URLs to search/
 * @return {Map} - Return back Map of Assets
 */
Process.prototype.findToRestore = function (urls) {
  var items = new Map();
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    var asset = this.findAssetByUrl(url);

    if (asset && asset.restored_file === '' && asset.status === '') {
      items.set(asset.key, asset);
    }
  }
  return items;
};

Process.prototype.findAssetByUrl = function (url) {
  var self = this;
  var key = utils.convertLinkToKey(self.settings.domain, url);
  return self.db.cdx.get(key);
};

/**
 * Restore process has completed.
 */
Process.prototype.complete = async function () {
  var me = this;

  this.results.ended = Date.now();

  if (this.settings.log) {
    try {
      await fs.outputFile(this.log_file, JSON.stringify(this.getLogData(), null, 2));
    } catch (err) {
      debug('Error saving log file', this.log_file, err);
    }
  }

  this.results.runtime_hms = utils.msToTime(this.results.ended - this.results.started);

  this.emit(EVENT.COMPLETED, this.results);
};

Process.prototype.setRestoring = function (asset) {
  asset.setRestoring();
  this.db.restored[asset.key] = RESTORE_STATUS.RESTORING;
  this.emit(RESTORE_STATUS.RESTORING, asset);
  return asset;
};

Process.prototype.setRestored = function (asset) {
  asset.setRestored();
  this.db.restored[asset.key] = RESTORE_STATUS.RESTORED;
  this.results.restored_count++;
  this.emit(RESTORE_STATUS.RESTORED, asset);

  return asset;
};

Process.prototype.restoreFailed = function (error, asset) {
  debug('restore failed', asset);
  debug(error);
  asset.setFailed();
  this.results.failed_count++;
  this.db.restored[asset.key] = RESTORE_STATUS.FAILD;
  this.emit(RESTORE_STATUS.FAILED, asset);
  this.emit(EVENTS.ERROR, error);
  return asset;
};

Process.prototype.maxPagesReached = function () {
  return this.settings.max_pages > 0 && this.results.restored_count >= this.settings.max_pages;
};

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = async function (dir) {
  try {
    await fs.emptyDir(dir);
  } catch (err) {
    debug('Error creating output directory', err);
  }
};

Process.prototype.getLogData = function (filename) {
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
 * Remove extraneous code from the restored content and cleanup links.
 */
Process.prototype.contentCleanup = function (content) {
  /**
   * makes http://domain-to-restore.com links relative
   */
  content = content.replace(this.root_linksre, '');

  content = content.replace(this.wb_re, '');
  content = content.replace(core.ARCHIVE_TEMPLATE_RE, '');

  return content;
};

/**
 * Clean up a URL by removing the wayback machine snapshot information.
 */
Process.prototype.cleanupWaybackUrl = function (link) {
  var url = link;

  url = url.replace(core.ARCHIVE_SOURCE_RE, '');

  url = url.replace(this.wb_re, '');

  // remove leading slashes
  url = url.replace(/^\/+/i, '');

  return url;
};

/**
 * Converts a URL to a local file path and name
 */
Process.prototype.convertToLocalFilePath = function (url, ext) {
  var obj = path.parse(utils.makeRelative(url));

  var dir = obj.dir;
  var filename = obj.name !== '' ? obj.name : 'index';
  //var ext = obj.ext !== "" ? obj.ext : ".html";

  dir = dir.replace(/^\//, ''); // remove leading slash
  dir = dir.replace(/\/$/, ''); // remove trailing slash

  /**
   * converts permalinks that are "folders" with no extension to an html page
   * Example: http://example.com/test to text/index.html
   */
  if (obj.name && obj.ext === '' && ext === 'html') {
    return path.join(dir, filename, 'index.' + ext);
  }

  return path.join(dir, filename + '.' + ext);
};

/**
 * This is the main restore process of a Wayback Machine archive.
 *
 * Rebuilds a website exactly how it appears in the Wayback Machine.
 */
module.exports = Process;
