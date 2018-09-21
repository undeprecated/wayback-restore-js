/*jshint node: true*/
/*global require, module */

/**
 * Utility for querying the Wayback Machine CDX server.
 */

'use strict';
var _ = require('lodash'),
    //querystring = require('querystring'),
    request = require('request');

var ArrayTransform = require('./array-transform'),
    JsonTransform = require('./json-transform'),
    FIELDS = require('./fields');

var CDX_SERVER = 'https://web.archive.org/cdx/search/cdx';

module.exports = {
    /**
     * Returns a JSON object containing a CDX record.
     *
     * @return JSON string
     */
    stream: function(options) {
        options = _.merge({
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
            matchType: null,
            // @TODO - need to un-gzip output
            //gzip: 'true',

            filter: null,
            limit: null,
            offset: null,
            to: null
        }, options);

        var arrayTransform = new ArrayTransform({
            objectMode: true
        });

        var jsonTransform = new JsonTransform({
            objectMode: true,
            fields: options.fl
        });

        var querystring = [];

        for (var key in options) {
            if (options.hasOwnProperty(key) && options[key] !== null) {
                var value;

                if (key === 'fl') {
                    value = options[key].join(',');
                } else {
                    value = options[key];
                }

                querystring.push(key + '=' + value);
            }
        }

        var url = CDX_SERVER +
            '?' + querystring.join('&');

        return request(url)
            .pipe(arrayTransform)
            .pipe(jsonTransform);
    }
};