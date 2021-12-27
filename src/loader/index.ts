import * as _module from 'module';
import * as path from 'path';
import * as fs from 'fs';
import * as v8 from 'v8';
import * as vm from 'vm';

v8.setFlagsFromString('--no-flush-bytecode');

import { headerUtils, getReferenceFlagHash, makeRequireFunction } from './utils';

export function loadBytecode(filename:string) {
  // 这里要求是同步的
  const bytecode = fs.readFileSync(filename, null);
  let bytesource = '';

  try {
    bytesource = fs.readFileSync(filename.replace(/\.bytecode$/i, '.bytesource'), 'utf-8');
  } catch (e) {}

  headerUtils.set(bytecode, 'flag_hash', getReferenceFlagHash());

  const sourceHash = headerUtils.buf2num(headerUtils.get(bytecode, 'source_hash'));
  const script = new vm.Script(bytesource.length === sourceHash ? bytesource :  ' '.repeat(sourceHash), {
    filename: filename,
    cachedData: bytecode
  });

  if (script.cachedDataRejected) {
    throw new Error('cannot load bytecode, check node version');
  }
  return script;
}

export function execRawByteCode(filename:string) {
  const script = loadBytecode(filename);
  return script.runInThisContext();
}

(_module as any)._extensions['.bytecode'] = function loadModule(module: any, filename:string) {
  const script = loadBytecode(filename);
  const wrapperFn = script.runInThisContext();
  const require = makeRequireFunction(module);
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
};
