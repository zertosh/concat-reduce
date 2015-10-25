'use strict';

var browserify = require('browserify');
var stream = require('stream');
var test = require('tap').test;
var transformReduce = require('../transform');

test('transform sync', function(t) {
  t.plan(4);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify(sourceFile);
  b.transform(transformReduce(function(src, file) {
    t.match(file, /\.js$/);
    t.equal(src, 'module.exports = 123;');
    return 'module.exports = 456;';
  }));

  b.bundle(function(err, src) {
    t.error(err);
    t.match(src, /module\.exports = 456;/);
  });
});

test('transform async', function(t) {
  t.plan(4);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify(sourceFile);
  b.transform(transformReduce(function(src, file) {
    var self = this;
    t.match(file, /\.js$/);
    t.equal(src, 'module.exports = 123;');
    setTimeout(function() {
      self.push('module.exports = 456;');
      self.push(null);
    })
  }));

  b.bundle(function(err, src) {
    t.error(err);
    t.match(src, /module\.exports = 456;/);
  });
});
