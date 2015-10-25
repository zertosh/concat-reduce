'use strict';

var fs = require('fs');
var test = require('tap').test;
var concatReduce = require('../');

var sourceFile = fs.readFileSync(__filename, 'utf8');

test('reduce sync', function(t) {
  t.plan(4);
  var str = '';
  var reduceStream = concatReduce(function(src) {
    t.equal(typeof src, 'string');
    return src.toUpperCase();
  });
  fs.createReadStream(__filename)
    .pipe(reduceStream)
    .on('data', function(buf) { str += buf; })
    .on('end', function() {
      t.equal(str, sourceFile.toUpperCase());
      t.equal(reduceStream._chunks, null);
      t.equal(reduceStream._reducer, null);
    });
});

test('reduce async', function(t) {
  t.plan(4);
  var str = '';
  var reduceStream = concatReduce(function(src) {
    t.equal(typeof src, 'string');
    var self = this;
    setTimeout(function() {
      self.push(src.toUpperCase());
      self.push(null);
    });
  });
  fs.createReadStream(__filename)
    .pipe(reduceStream)
    .on('data', function(buf) { str += buf; })
    .on('end', function() {
      t.equal(str, sourceFile.toUpperCase());
      t.equal(reduceStream._chunks, null);
      t.equal(reduceStream._reducer, null);
    });
});
