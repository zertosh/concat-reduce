'use strict';

var stream = require('stream');
var util = require('util');

module.exports = ConcatReduce;
util.inherits(ConcatReduce, stream.Transform);

function ConcatReduce(reducer) {
  if (!(this instanceof ConcatReduce)) {
    return new ConcatReduce(reducer)
  }
  if (typeof reducer !== 'function') {
    throw new Error('"reducer" callback is required');
  }
  stream.Transform.call(this);
  this._chunks = [];
  this._reducer = reducer;
  this.once('end', this._destroy);
}

ConcatReduce.prototype._transform = function(buf, enc, cb) {
  this._chunks.push(buf);
  cb();
};

ConcatReduce.prototype._flush = function(cb) {
  var src = String(Buffer.concat(this._chunks));
  var ret = this._reducer.call(this, src);
  if (typeof ret !== 'undefined') {
    this.push(ret);
    cb();
  }
};

ConcatReduce.prototype._destroy = function() {
  this._reducer = this._chunks = null;
};
