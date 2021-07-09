/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

// Core Modules
var debug = require('debug')('wayback:downloader');
var es = require('event-stream');
var util = require('util');
var EventEmitter = require('events');
var path = require('path');
var async = require('async');

// Local Modules
var core = require('./core');
var utils = require('./utils');
var Asset = require('./asset');
const { snapshot } = require('./snapshot');

// Events fired by Process
var EVENT = core.EVENTS;

var RESTORE_STATUS = core.RESTORE_STATUS;

function Process(options) {
  EventEmitter.call(this);

  const defaults = {
    url: '', // a url snapshot
    from: '', // earliest files to download from: yyyyMMddhhmmss
    to: '', // latest timestamp:  yyyyMMddhhmmss
    limit: 0, // limit number of files to download,
    list: false, // true - will only download,
    concurrency: 1, // number of files to download at the same time,
    only: '', // only include these file types
    exclude: '', // exclude these file types,
    directory: '.' // restores to current directory,
  };

  this.options = Object.assign(defaults, options);

  this.domain = utils.getDomain(this.options.url);

  if (!this.domain || this.domain === '') {
    throw 'Could not parse domain';
  }

  debug('Options', this.options);

  this.snapshot = {
    url: this.options.url,
    fl: this.options.fl || [
      'urlkey',
      'timestamp',
      'original',
      'mimetype',
      'statuscode',
      'digest',
      'length'
    ],
    filter: this.options.filter || 'statuscode:200',
    collapse: this.options.collapse || 'digest',
    matchType: this.options.matchType || null,
    limit: this.options.limit || null,
    offset: this.options.offset || null,
    to: null,
    from: null
  };

  if (this.options.from && this.options.from !== '') {
    this.snapshot.from = this.options.from;
  }

  if (this.options.to && this.options.to !== '') {
    this.snapshot.to = this.options.to;
  }

  if (this.options.only !== '') {
    this.snapshot.only = this.options.only;
  }

  if (this.options.exclude !== '') {
    this.snapshot.exclude = this.options.exclude;
  }

  /**
   * Base directory where a restore directory will be output.
   */
  this.restore_directory = path.normalize(
    utils.resolveHome(this.options.directory) + '/' + this.domain
  );

  this.results = {
    domain: this.domain,
    directory: this.restore_directory,
    started: '',
    ended: '',
    runtime_hms: '',
    file_count: 0,
    restored_count: 0,
    failed_count: 0,
    options: this.options,
    numSnapshots: 0,
    cdxUrl: ''
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

  await utils.createOutputDirectory(this.restore_directory);

  /**
   * Sets up our restore queue.
   */
  this.q = async.queue(async (asset, cb) => {
    await this.restoreAsset(asset);
    callback(asset);
    cb();
  }, this.options.concurrency);

  this.q.drain = async () => {
    return await this.complete();
  };

  // This method finds all CDX snapshots and restores based on the results.
  const [snapshots, cdxUrl] = await snapshot(this.snapshot, (asset) => {
    this.q.push(asset);
  });

  this.results.numSnapshots = snapshots.length;
  this.results.cdxUrl = cdxUrl;

  // complete event will never fire if nothing goes into the queue
  if (snapshots.length === 0) {
    //if (this.results.file_count === 0) {
    this.complete();
  }

  return this;
};

Process.prototype.restoreAsset = async function (asset) {
  try {
    // Stores files as /restore-dir/domain.com/yyyymmddhhmmss/index.html
    var local_file = path.join(this.restore_directory, asset.timestamp, asset.getLocalFilePath());
    this.setRestoring(asset);
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

module.exports = Process;
