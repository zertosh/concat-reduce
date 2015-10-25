'use strict';

var fs = require('fs');
var test = require('tap').test;
var concatReduce = require('../');

var sourceFile = fs.readFileSync(__filename, 'utf8');

test('reduce sync', function(t) {
  t.plan(2);
  var str = '';
  fs.createReadStream(__filename)
    .pipe(concatReduce(function(src) {
      t.equal(typeof src, 'string');
      return src.toUpperCase();
    }))
    .on('data', function(buf) { str += buf; })
    .on('end', function() {
      t.equal(str, sourceFile.toUpperCase());
    });
});

test('reduce async', function(t) {
  t.plan(2);
  var str = '';
  fs.createReadStream(__filename)
    .pipe(concatReduce(function(src) {
      t.equal(typeof src, 'string');
      var self = this;
      setTimeout(function() {
        self.push(src.toUpperCase());
        self.push(null);
      });
    }))
    .on('data', function(buf) { str += buf; })
    .on('end', function() {
      t.equal(str, sourceFile.toUpperCase());
    });
});
