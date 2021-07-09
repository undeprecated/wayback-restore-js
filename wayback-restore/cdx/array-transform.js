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

  //self._buffer = Buffer.alloc(0);
  //self._space = ' '.charCodeAt(0);
  //self._newLine = '\n'.charCodeAt(0);

  //if (!(this instanceof ArrayTransform)) {
  //    return new ArrayTransform(options);
  //}

  if (!options) {
    options = {};
  }

  options.objectMode = true;

  stream.Transform.call(self, options);
}

util.inherits(ArrayTransform, stream.Transform);

ArrayTransform.prototype._transform = function (buf, encoding, nextData) {
  this.push(buf.split(' '));

  nextData();
};

module.exports = ArrayTransform;
