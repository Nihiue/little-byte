# little-byte

Compile Node.js code into bytecode.

[中文文档](./README.zhCN.md)

![typescript](https://img.shields.io/npm/types/scrub-js.svg)
[![npm version](https://badge.fury.io/js/little-byte.svg)](https://www.npmjs.com/package/little-byte)
![test status](https://github.com/nihiue/little-byte/actions/workflows/test.yaml/badge.svg)

## Install

```bash
$ npm install --save-dev little-byte
```

## Compile App

### Prepare Build Script

Create build/index.js

```javascript
const { walker } = require('little-byte').default;
const path = require('path');

walker.start({
  inputDir: path.join(__dirname, '../src'),
  outputDir: path.join(__dirname, '../dist'),
  onFile(fileInfo, defaultAction) {
    if (fileInfo.relativePath.startsWith('foobar/')) {
      return 'ignore';
    }

    if (fileInfo.ext === '.jpg') {
      return 'ignore';
    }

    if (fileInfo.name === 'my-dog.txt') {
      return 'ignore';
    }

    if (fileInfo.isScript) {
      return 'compile';
    } else {
      // copy none-js files to dist folder
      return 'copy';
    }
  }
});
```

### Build

```bash
$ node build/index.js
```

## Run Compiled App

Create app-entry.js

```javascript

require('little-byte');

// now you can require *.bytecode
require('./dist/index');

```

## Limitations

### Using same Node.js version for building and running bytecode

The format of bytecode might change over Node.js versions.

### Bytecode does not protect constant values

It's possible to recover constant strings from bytecode with hex editor.


## For More Info

[Docs](https://translate.google.com/translate?js=n&sl=chinese&tl=en&u=https://github.com/Nihiue/little-byte-demo) By Google Translate

