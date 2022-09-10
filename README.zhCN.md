# little-byte

将 Node.js 应用代码编译为字节码

[英文文档 | English Docs](https://github.com/Nihiue/little-byte/blob/main/README.md)

![typescript](https://img.shields.io/npm/types/scrub-js.svg)
[![npm version](https://badge.fury.io/js/little-byte.svg)](https://www.npmjs.com/package/little-byte)
[![Test Suite](https://github.com/Nihiue/little-byte/actions/workflows/test.yaml/badge.svg)](https://github.com/Nihiue/little-byte/actions/workflows/test.yaml)

## 安装

```bash
$ npm install --save-dev little-byte
```

## 编译应用

### 准备编译脚本

创建 build/index.js

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

### 编译

```bash
$ node build/index.js
```

## 运行编译后的应用

创建 app-entry.js

```javascript

require('little-byte');

// now you can require *.bytecode
require('./dist/index');

```

## 限制

### 编译和运行字节码需要使用相同版本的 Node.js

不同版本的 Node.js 可能使用不同的字节码格式

### 字节码不能保护代码中的常量值

可以使用16进制编辑器从字节码中恢复出字符串等常量的值


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

## 原理 & 设计思路

[通过字节码保护Node.js源码之原理篇](https://zhuanlan.zhihu.com/p/359235114)

[源代码与 Bytecode 性能测试](./benchmark.md)

[Node.js 字节码源码相关问题补完](https://zhuanlan.zhihu.com/p/419591875)
