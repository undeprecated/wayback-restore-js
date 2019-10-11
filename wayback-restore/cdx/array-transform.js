/*jshint node: true*/
/*global require, module */

/**
 * A stream.Transform to convert CDX Query input into a JSON object.
 */

'use strict';

var util = require('util'),
    stream = require('stream');

function ArrayTransform(options) {
    var self = this;

    self._buffer = Buffer.alloc(0);
    self._space = ' '.charCodeAt(0);
    self._newLine = '\n'.charCodeAt(0);

    if (!(this instanceof ArrayTransform)) {
        return new ArrayTransform(options);
    }

    if (!options) {
        options = {};
    }

    options.objectMode = true;

    stream.Transform.call(self, options);
}

util.inherits(ArrayTransform, stream.Transform);

ArrayTransform.prototype._transform = function(buf, encoding, nextData) {
    var obj = [],
        numFields = 7,
        previndex = 0,
        index = 0;

    var bufLen = this._buffer.length + buf.length;

    this._buffer = Buffer.concat([this._buffer, buf], bufLen);

    for (var b of this._buffer) {
        index++;

        if (b === this._space || b === this._newLine) {
            var part = this._buffer.slice(previndex, index - 1);
            obj.push(part.toString());
            previndex = index;
        }

        if (obj.length >= numFields) {
            this.push(obj);

            obj = [];
        }
    }

    nextData();
};

/*
ArrayTransform.prototype._flush = function(callback) {
    this.push(null);
    callback();
};*/

/*
ArrayTransform.prototype._flush = function (next) {
    this._transform(data);
    next();
};
*/

module.exports = ArrayTransform;