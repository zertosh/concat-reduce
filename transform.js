'use strict';

var concatReduce = require('./');

module.exports = function(callback) {
  return function(file) {
    return concatReduce(function(src) {
      return callback.call(this, src, file);
    });
  }
};
