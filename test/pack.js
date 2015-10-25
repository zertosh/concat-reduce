'use strict';

var browserify = require('browserify');
var stream = require('stream');
var test = require('tap').test;
var packReduce = require('../pack');

test('pack sync', function(t) {
  t.plan(3);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify(sourceFile);
  b.plugin(packReduce, function(src) {
    t.equal(typeof src, 'string');
    return '/* license */' + src;
  });

  b.bundle(function(err, src) {
    t.error(err);
    t.equal(String(src).indexOf('/* license */'), 0);
  });
});

test('pack async', function(t) {
  t.plan(3);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify(sourceFile);
  b.plugin(packReduce, function(src) {
    t.equal(typeof src, 'string');
      var self = this;
      setTimeout(function() {
        self.push('/* license */' + src);
        self.push(null);
      });
  });

  b.bundle(function(err, src) {
    t.error(err);
    t.equal(String(src).indexOf('/* license */'), 0);
  });
});

test('pack in opts', function(t) {
  t.plan(3);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify({
    entries: sourceFile,
    plugin: [[packReduce, reducer]]
  });

  function reducer(src) {
    t.equal(typeof src, 'string');
    return '/* license */' + src;
  }

  b.bundle(function(err, src) {
    t.error(err);
    t.equal(String(src).indexOf('/* license */'), 0);
  });
});

test('pack reapply', function(t) {
  t.plan(6);

  var sourceFile = new stream.PassThrough();
  sourceFile.end('module.exports = 123;');

  var b = browserify({
    entries: sourceFile,
    plugin: [[packReduce, reducer]]
  });

  function reducer(src) {
    t.equal(typeof src, 'string');
    return '/* license */' + src;
  }

  function bundle() {
    return b.bundle(function(err, src) {
      t.error(err);
      t.equal(String(src).indexOf('/* license */'), 0);
    });
  }

  bundle().on('end', function() { bundle(); });
});

