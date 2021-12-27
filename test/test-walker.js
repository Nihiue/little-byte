const { walker } = require('../lib/index').default;
const path = require('path');

walker.start({
  inputDir: path.join(__dirname, 'input'),
  outputDir: path.join(__dirname, 'output'),
  onFile(fileInfo, defaultAction) {
    if (fileInfo.relativePath.startsWith('foobar/')) {
      return 'ignore';
    }
    
    if (fileInfo.isScript) {
      return 'compile';
    } else {
      return 'copy';
    }
  }
});