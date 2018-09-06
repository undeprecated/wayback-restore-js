/*jshint node: true*/
/*global require, module */

/**
 * Utility for querying the Wayback Machine CDX server.
 */

'use strict';
var querystring = require('querystring'),
    request     = require('request');

var ArrayTransform = require('./array-transform'),
    JsonTransform  = require('./json-transform'),
    FIELDS         = require('./fields');


var CDX_SERVER = 'http://web.archive.org/cdx/search/cdx';

var defaults = {
    url: '',
    fl: [
        FIELDS.URLKEY,
        FIELDS.TIMESTAMP,
        FIELDS.ORIGINAL,
        FIELDS.MIMETYPE,
        FIELDS.STATUSCODE,
        FIELDS.DIGEST,
        FIELDS.LENGTH
    ],
    outputFormat: 'json',
    matchType: 'exact',
    gzip: 'true',
    filter: null,
    limit: null,
    offset: null
};

/**
 * Returns a JSON object containing a CDX record.
 *
 * @return JSON string
 */
function stream(options) {
    var arrayTransform = new ArrayTransform({
        objectMode: true
      });

    var jsonTransform = new JsonTransform({
      objectMode: true,
      fields: options.fl
    });

    var url = CDX_SERVER +
              '?' +
              querystring.stringify(options);

    return request(url)
        .pipe( arrayTransform )
        .pipe( jsonTransform );
};

module.exports = {
  stream: stream
};
