/*jshint node: true*/
/*global require, module */

/**
 * A stream.Transform to parse CDX Query row
 */

var util = require('util');
var stream = require('stream');

function RecordTransform(options) {
  if (!options) {
    options = {};
  }

  stream.Transform.call(this, options);
}

util.inherits(RecordTransform, stream.Transform);

RecordTransform.prototype._transform = function (chunk, encoding, done) {
  var data = chunk.toString();

  if (this._lastLineData) {
    data = this._lastLineData + data;
  }

  var lines = data.split('\n');
  this._lastLineData = lines.splice(lines.length - 1, 1)[0];

  lines.forEach(this.push.bind(this));

  done();
};

RecordTransform.prototype._flush = function (done) {
  if (this._lastLineData) {
    this.push(this._lastLineData);
  }
  this._lastLineData = null;
  done();
};

module.exports = RecordTransform;
