/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

// Core Modules
var debug = require('debug')('wayback:snapshot');
var es = require('event-stream');
var CdxQuery = require('./cdx/query');
var Asset = require('./asset');

// @TODO: validate options
module.exports.snapshot = function snapshot(options, callback) {
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
    output: options.output || 'json',
    matchType: options.matchType || null,
    limit: options.limit || null,
    offset: options.offset || null,
    to: options.to || null,
    from: options.from || null
  };

  const cdxQuery = new CdxQuery(query);
  const snapshots = [];

  return new Promise((resolve, reject) => {
    try {
      cdxQuery
        .stream()
        .on('end', () => {
          resolve([snapshots, cdxQuery.url]);
        })
        .pipe(
          es.map((record, next) => {
            record = JSON.parse(record);

            const asset = new Asset.Asset();

            asset.key = record.urlkey;
            asset.original_url = record.original;
            asset.timestamp = record.timestamp;
            asset.mimetype = record.mimetype;
            asset.type = Asset.convertMimeType(record.mimetype);
            debug('Snapshot', asset);

            snapshots.push(asset);

            if (callback) {
              callback(asset);
            }

            next(null, asset);
          })
        );
    } catch (e) {
      reject(e);
    }
  });
};
