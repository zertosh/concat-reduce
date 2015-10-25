# concat-reduce

Concats a stream, then applies a reducer function to the joined result.

## Usage

### `concat-reduce`

### `concat-reduce/pack`

```js
var packReduce = require('concat-reduce/pack');
var b = browserify('index.js');
b.plugin(packReduce, function(src) {
  // This is the last step in the browserify pipeline.
  // `src` is the entire bundle.
  return header + src;
});
b.bundle(function(err, src) {
  assert(src.startsWith(header));
});
```

### `concat-reduce/transform`

```js
var transformReduce = require('concat-reduce/transform');
var b = browserify('index.js');
b.transform(transformReduce(function(src, file) {
  // `src` is a single module, and file is the filename.
  return header + src;
}));
```
