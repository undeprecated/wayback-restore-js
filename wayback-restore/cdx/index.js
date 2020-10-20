/* jshint node: true */
/*global require, module */

/**
 * Utility for querying the Wayback Machine CDX server.
 */

"use strict";
var request = require("request");

var ArrayTransform = require("./array-transform");
var JsonTransform = require("./json-transform");
var FIELDS = require("./fields");

var CDX_SERVER = "https://web.archive.org/cdx/search/cdx";

function Query(config) {
  this.url = "";
  this.options = Object.assign(
    {
      url: "",
      fl: [
        FIELDS.URLKEY,
        FIELDS.TIMESTAMP,
        FIELDS.ORIGINAL,
        FIELDS.MIMETYPE,
        FIELDS.STATUSCODE,
        FIELDS.DIGEST,
        FIELDS.LENGTH
      ],
      outputFormat: "json",
      matchType: null,
      // @TODO - need to un-gzip output
      //gzip: 'true',

      filter: null,
      limit: null,
      offset: null,
      to: null
    },
    config
  );
  this.__init__();
}

Query.prototype.__init__ = function() {
  var querystring = [];

  for (var key in this.options) {
    if (this.options.hasOwnProperty(key) && this.options[key] !== null) {
      var value;

      if (key === "fl") {
        value = this.options[key].join(",");
      } else {
        value = this.options[key];
      }

      querystring.push(key + "=" + value);
    }
  }

  this.url = CDX_SERVER + "?" + querystring.join("&");
};

/**
 * Returns a JSON object containing a CDX record.
 *
 * @return JSON string
 */
Query.prototype.stream = function() {
  var arrayTransform = new ArrayTransform({ objectMode: true });

  var jsonTransform = new JsonTransform({
    objectMode: true,
    fields: this.options.fl
  });

  return request(this.url)
    .pipe(arrayTransform)
    .pipe(jsonTransform);
};

module.exports = {
  Query: Query
};
