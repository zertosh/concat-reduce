'use strict';

var concatReduce = require('./');

module.exports = function apply(b, done) {
  b.pipeline.get('pack').push(concatReduce(done));
  b.once('reset', function() { apply(b, done); });
};
