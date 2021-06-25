/**
 * This is the main entry library to wayback-restore
 *
 *
 * @TODO Implement a throttle system so we don't hammer the request server
 *     - https://github.com/alltherooms/throttled-request
 * @TODO add CLI support
 *
 */

var Restore = require('./restore');
var Downloader = require('./downloader');
var query = require('./cdx/query');
var snapshot = require('./snapshot');
var core = require('./core');

module.exports = {
  VERSION: core.VERSION,
  restore: (options) => {
    return new Restore(options);
  },
  downloader: (options) => {
    return new Downloader(options);
  },
  download: (options) => {
    return new Downloader(options);
  },
  snapshot: snapshot.snapshot,
  cdx: query
};
