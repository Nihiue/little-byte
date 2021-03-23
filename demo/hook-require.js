const _module = require('module');
const path = require('path');

const { loadBytecode } = require('./loader');

_module._extensions['.bytecode'] = function (module, filename) {
  const script = loadBytecode(filename, false);
  const wrapperFn = script.runInThisContext({
    filename: filename
  });

  // 这里的参数列表和之前的 wrapper 函数是一一对应的
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
}
