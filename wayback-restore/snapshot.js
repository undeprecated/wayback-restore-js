/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

// Core Modules
var debug = require('debug')('wayback:snapshot');
var es = require('event-stream');
var CdxQuery = require('./cdx/query');
var Asset = require('./asset');

/**
 * This method finds all CDX snapshots and restores based on the results.
 */
/*
function snapshotDownload(options={
    url: 'example.com',
    filter: "statuscode:200",
    collapse: "timestamp:8,digest",
    to: '2018'
  }) {

  const [snapshots] = await snapshot(options);

  const q = async.queue((asset, callback) => {
    restoreAsset(asset, callback);
  }, concurrency);

  q.drain = async () => {
    return await complete();
  };

  snapshots.forEach((asset, keys) => {
    q.push(asset);
  });
  return q
}
*/

function filter(expr, file_url) {
  if (expr !== '') {
    let regex = new RegExp(expr);
    return regex.test(file_url);
  } else {
    return true;
  }
}
module.exports.filter = filter;

// @TODO: validate options
module.exports.snapshot = function snapshot(options, callback) {
  options.only = options.only || '';
  options.exclude = options.exclude || '';

  let query = {
    url: options.url,
    fl: options.fl || [
      'urlkey',
      'timestamp',
      'original',
      'mimetype',
      'statuscode',
      'digest',
      'length'
    ],
    filter: options.filter || 'statuscode:200',
    collapse: options.collapse || 'digest',
    //output: options.output || null,
    matchType: options.matchType || null,
    limit: options.limit || null,
    offset: options.offset || null,
    to: options.to || null,
    from: options.from || null
  };

  const match_exclude_filter = function (file_url) {
    if (options.exclude !== '') {
      return exclude_regex.test(file_url);
    } else {
      return false;
    }
  };

  const match_only_filter = function (file_url) {
    if (options.only !== '') {
      return only_include_regex.test(file_url);
    } else {
      return true;
    }
  };

  const snapshots = [];
  const cdxQuery = new CdxQuery(query);
  let index = 0;

  if (options.only !== '') {
    only_include_regex = new RegExp(options.only);
  }

  if (options.exclude !== '') {
    exclude_regex = new RegExp(options.exclude);
  }

  return new Promise((resolve, reject) => {
    try {
      cdxQuery
        .stream()
        .on('end', () => {
          resolve([snapshots, cdxQuery.url]);
        })
        .pipe(
          es.map((record, next) => {
            // maybe provide option to return raw record?
            /*if (callback) {
              callback(record);
            }

            next(null, record);*/

            if (match_exclude_filter(record.original)) {
              debug('Asset excluded:', record);
              next();
            } else if (!match_only_filter(record.original)) {
              debug('Asset filtered out:', record);
              next();
            } else {
              record = JSON.parse(record);

              const asset = new Asset.Asset();

              asset.index = index++;
              asset.key = record.urlkey;
              asset.original_url = record.original;
              asset.timestamp = record.timestamp;
              asset.mimetype = record.mimetype;
              asset.type = Asset.convertMimeType(record.mimetype);
              debug('Snapshot', record);

              snapshots.push(asset);

              if (callback) {
                callback(asset);
              }

              next(null, asset);
            }
          })
        );
    } catch (e) {
      reject(e);
    }
  });
};
