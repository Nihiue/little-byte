# little-byte-package

Compile Node.js code into bytecode.

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

## How Does It Work

[English](https://translate.google.com/translate?js=n&sl=chinese&tl=en&u=https://github.com/Nihiue/little-byte)

[Chinese](https://github.com/Nihiue/little-byte)
