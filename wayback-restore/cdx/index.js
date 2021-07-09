/**
 * A low level module for working with web.archive.org's CDX server.
 *
 */

var Query = require('./query');

module.exports.query = function (query) {
  return new Query(query);
};
