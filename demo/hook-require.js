const _module = require('module');
const path = require('path');
const makeRequire = require('./make-require');
const { loadBytecode } = require('./loader');

_module._extensions['.bytecode'] = function (module, filename) {
  const script = loadBytecode(filename, false);
  const wrapperFn = script.runInThisContext({
    filename: filename,
    displayErrors: true,
    lineOffset: 0,
    columnOffset: 0,
  });
  const require = makeRequire(module);
  // 这里的参数列表和之前的 wrapper 函数是一一对应的
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
}
