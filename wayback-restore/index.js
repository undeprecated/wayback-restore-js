/**
 * This is the main entry library to wayback-restore
 *
 *
 * @TODO Implement a throttle system so we don't hammer the request server
 *     - https://github.com/alltherooms/throttled-request
 * @TODO add CLI support
 *
 */

var restore = require("./restore");
var cdx = require("./cdx");
var core = require("./core");
var parse = require("./parse");

module.exports = {
  VERSION: core.VERSION,
  restore: restore,
  cdx: cdx,
  parse: parse.parse,
  parseDomain: parse.parseDomain,
  parseTimestamp: parse.parseTimestamp
};
