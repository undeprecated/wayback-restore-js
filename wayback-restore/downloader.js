/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

// Core Modules
var debug = require('debug')('wayback:downloader');
var es = require('event-stream');
var util = require('util');
var EventEmitter = require('events');
var path = require('path');
var async = require('async');

// Third-Party Modules
var fs = require('fs-extra');

// Local Modules
var core = require('./core');
var utils = require('./utils');
var Asset = require('./asset');
var CdxQuery = require('./cdx/query');

// Events fired by Process
var EVENT = core.EVENTS;

var RESTORE_STATUS = core.RESTORE_STATUS;

function Process(options) {
  EventEmitter.call(this);

  const defaults = {
    url: '', // an url snapshot
    domain: '', // example.com
    from: '', // earliest files to download from: yyyyMMddhhmmss
    to: '', // latest timestamp:  yyyyMMddhhmmss
    limit: 0, // limit number of files to download,
    exact_url: false, // true - downloads only this file and not full site
    list: false, // true - will only download,
    concurrency: 1, // number of files to download at the same time,
    only: '', // only include these file types
    exclude: '', // exclude these file types,
    directory: '.' // restores to current directory,
  };

  // Example: Wayback.downloader("http://web.archive.org/web/20150531/http://www.example.com")
  if (typeof options === 'string') {
    let url = options;
    options = {};
    options.url = url;
    options.exact_url = true;
  }

  this.options = Object.assign(defaults, options);

  if (this.options.url !== '') {
    const { domain } = utils.parse(this.options.url);
    this.options.domain = domain;
  }

  if (this.options.domain === '') {
    throw 'Invalid options: domain required';
  }

  debug('Options', this.options);

  if (this.options.only !== '') {
    this.only_include_regex = new RegExp(this.options.only);
  }

  if (this.options.exclude !== '') {
    this.exclude_regex = new RegExp(this.options.exclude);
  }

  let query = {};

  if (options.from !== '') {
    query.from = options.from;
  }

  if (options.to !== '') {
    query.to = options.to;
  }

  if (options.exact_url) {
    query.url = this.options.url;
  } else {
    query.url = this.options.domain + '*';
  }

  this.cdxQuery = new CdxQuery({
    filter: 'statuscode:200',
    collapse: 'digest',
    ...query
  });

  /**
   * Base directory where a restore directory will be output.
   */
  this.restore_directory = path.normalize(
    utils.resolveHome(this.options.directory) + '/' + this.options.domain
  );

  this.results = {
    domain: this.options.domain,
    directory: this.restore_directory,
    started: '',
    ended: '',
    runtime_hms: '',
    restored_count: 0,
    failed_count: 0,
    options: this.options
  };
}

util.inherits(Process, EventEmitter);

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

/**
 *
 * @param {Function} callback - A function executed on each restore or asset listing depending on options.list
 */
Process.prototype.start = async function (callback) {
  this.results.started = Date.now();

  this.emit(EVENT.STARTED, this.results.started);

  /*if (this.options.list) {
    await this.list();
    //this.complete();
    return;
  }*/

  await this.createOutputDirectory(this.restore_directory);

  /**
   * Sets up our restore queue.
   */
  this.q = async.queue(async (asset, cb) => {
    if (!this.options.list) {
      await this.restoreAsset(asset);
    }
    callback(asset);
    cb();
  }, this.options.concurrency);

  this.q.drain = async () => {
    return await this.complete();
  };

  /**
   * This method finds all CDX snapshots and restores based on the results.
   */
  await this.list();
  /*await this.list((asset) => {
    if (asset) {
      this.q.push(asset);
    }
  });*/

  return this;
};

Process.prototype.list = async function (callback) {
  try {
    return await this.cdxQuery
      .stream()
      .on('end', () => {})
      .pipe(
        es.map((record, next) => {
          record = JSON.parse(record);

          if (this.match_exclude_filter(record.original)) {
            debug('Asset excluded:', record);
            next();
          } else if (!this.match_only_filter(record.original)) {
            debug('Asset filtered out:', record);
            next();
          } else {
            const asset = new Asset.Asset();

            asset.key = record.urlkey;
            asset.original_url = record.original;
            asset.timestamp = record.timestamp;
            asset.mimetype = record.mimetype;
            asset.type = Asset.convertMimeType(record.mimetype);

            this.emit(EVENT.CDXQUERY, asset);

            debug('Listing:', asset);

            // @NOTE: this.q does not exist if list() is invoked and not start
            if (this.q) {
              this.q.push(asset);
            }

            if (callback) {
              callback(asset);
            }

            next(null, record);
          }
        })
      );
  } catch (e) {
    console.error(e);
  }
};

Process.prototype.match_exclude_filter = function (file_url) {
  if (this.options.exclude !== '') {
    return this.exclude_regex.test(file_url);
  } else {
    return false;
  }
};

Process.prototype.match_only_filter = function (file_url) {
  if (this.options.only !== '') {
    return this.only_include_regex.test(file_url);
  } else {
    return true;
  }
};

Process.prototype.restoreAsset = async function (asset) {
  debug('Restoring Asset: ', asset);
  // Stores files as /restore-dir/domain.com/yyyymmddhhmmss/index.html
  var local_file = path.join(this.restore_directory, asset.timestamp, asset.localFilePath());

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
 * Restore process has completed.
 */
Process.prototype.complete = async function () {
  var me = this;

  this.results.ended = Date.now();

  this.results.runtime_hms = utils.msToTime(this.results.ended - this.results.started);

  this.emit(EVENT.COMPLETED, this.results);
};

Process.prototype.setRestoring = function (asset) {
  asset.setRestoring();
  this.emit(RESTORE_STATUS.RESTORING, asset);
  return asset;
};

Process.prototype.setRestored = function (asset) {
  asset.setRestored();
  this.results.restored_count++;
  this.emit(RESTORE_STATUS.RESTORED, asset);

  return asset;
};

Process.prototype.restoreFailed = function (error, asset) {
  debug('restore failed', asset);
  debug(error);
  asset.setFailed();
  this.results.failed_count++;
  this.emit(RESTORE_STATUS.FAILED, asset);
  this.emit(EVENTS.ERROR, error);
  return asset;
};

Process.prototype.maxPagesReached = function () {
  return this.options.max_pages > 0 && this.results.restored_count >= this.options.max_pages;
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

module.exports = Process;
