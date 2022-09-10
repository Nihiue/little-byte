# little-byte

Compile Node.js code into bytecode.

[中文文档 | Chinese Docs](https://github.com/Nihiue/little-byte/blob/main/README.zhCN.md)

![typescript](https://img.shields.io/npm/types/scrub-js.svg)
[![npm version](https://badge.fury.io/js/little-byte.svg)](https://www.npmjs.com/package/little-byte)
[![Test Suite](https://github.com/Nihiue/little-byte/actions/workflows/test.yaml/badge.svg)](https://github.com/Nihiue/little-byte/actions/workflows/test.yaml)

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

## API

``` typescript

littleByte.compiler.compileFile(filePath: string, outputDir?: string): Promise<void>

littleByte.loader.loadBytecode(filePath: string): vm.Script;

littleByte.loader.execByteCode(filePath: string): any;


type WalkAction = 'ignore' | 'compile' | 'copy';

type FileInfo = {
    path: string;
    relativePath: string;
    name: string;
    ext: string;
    isScript: boolean;
};

interface WalkOptions {
    silent?: boolean;
    inputDir: string;
    outputDir: string;
    onFile: (fileinfo: FileInfo, defaultAction: WalkAction) => WalkAction;
}

littleByte.walker.start(options: WalkOptions): Promise<void>;

```

## Related Articles

[Principles of protecting Node.js source code through bytecode](https://translate.google.com/website?sl=auto&tl=en&hl&u=https://zhuanlan.zhihu.com/p/359235114)

[Source code and Bytecode performance test](https://github-com.translate.goog/Nihiue/little-byte-demo/blob/main/benchmark.md?_x_tr_sl=auto&_x_tr_tl=en)

[Node.js bytecode source related issues completed](https://translate.google.com/website?sl=auto&tl=en&hl&u=https://zhuanlan.zhihu.com/p/419591875)

Powered By Google Translate
