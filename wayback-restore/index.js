/**
 * This is the main entry library to wayback-restore
 *
 *
 * @TODO Implement a throttle system so we don't hammer the request server
 *     - https://github.com/alltherooms/throttled-request
 * @TODO add CLI support
 *
 */

var core = require('./core');
var { snapshot } = require('./snapshot');
var { downloadAsset, createAsset } = require('./asset');
var Restore = require('./restore');
var Downloader = require('./downloader');

module.exports = {
  VERSION: core.VERSION,
  restore: (options) => {
    return new Restore(options);
  },
  downloader: (options) => {
    return new Downloader(options);
  },
  snapshot,
  createAsset,
  downloadAsset
};
