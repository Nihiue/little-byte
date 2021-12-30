const assert = require('assert');
const path = require('path');
const fs = require('fs');
const littleByte = require('../lib/index').default;

async function fileExists(name) {
  try {
    await fs.promises.stat(path.join(__dirname, name));
    return true;
  } catch (e) {
    return false;
  }
}

describe('Compile ByteCode', function () {
  it('should compile without error', async function () {
    await littleByte.walker.start({
      silent: true,
      inputDir: path.join(__dirname, 'app'),
      outputDir: path.join(__dirname, 'dist'),
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
  });

  it('should generate bytecode', async function () {
    assert(await fileExists('dist/index.bytecode'));
    assert(await fileExists('dist/sub/index.bytecode'));
  });

  it('should generate bytesouce', async function () {
    assert(await fileExists('dist/index.bytesource'));
    assert(await fileExists('dist/sub/index.bytesource'));
  });

  it('should copy files', async function () {
    assert(await fileExists('dist/sub/textfile.txt'));
  });

  it('should ignore files', async function () {
    assert.strictEqual(await fileExists('dist/foobar/foo.js'), false);
  });
});

describe('Run ByteCode', function () {

  it('app runs without error', function () {
    require('./dist/index');
  });

  function getSub() {
    const sub = require('./dist/sub/index');
    const sayHello = sub.sayHello.toString();
    const myClass = sub.myClass.toString();
    return { sub, sayHello, myClass };
  }

  it('function.toString() includes declaration', function () {
    const { sub, sayHello, myClass } = getSub();

    assert(sayHello.includes('function sayHello'));
    assert(myClass.includes('class myClass'));
    assert(myClass.includes('constructor'));
    assert(myClass.includes('inc()'));
  });

  it('function.toString() does not include function body', function () {
    const { sub, sayHello, myClass } = getSub();

    assert(!myClass.includes('return this.value'));
    assert(!sayHello.includes('console.log'));
  });

  it('exception in async arrow function does not crash', async function () {
    const { sub, sayHello, myClass } = getSub();

    try {
      await sub.asyncArrowException();
    } catch (e) { }
  })

  it('stack trace works', function () {
    const { sub, sayHello, myClass } = getSub();
    assert(sub.stackTrace().includes('/sub/index.js:'));
  })
})
