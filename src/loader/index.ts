import * as _module from 'module';
import * as path from 'path';
import * as fs from 'fs';
import * as v8 from 'v8';
import * as vm from 'vm';

v8.setFlagsFromString('--no-flush-bytecode');

import { headerUtils, getReferenceFlagHash, makeRequireFunction } from './utils';

export function loadBytecode(filename:string) {
  // 这里要求是同步的
  const byteBuffer = fs.readFileSync(filename, null);
  let bytesource = '';

  try {
    bytesource = fs.readFileSync(filename.replace(/\.bytecode$/i, '.bytesource'), 'utf-8');
  } catch (e) {}

  headerUtils.set(byteBuffer, 'flag_hash', getReferenceFlagHash());

  const sourceLength = headerUtils.buf2num(headerUtils.get(byteBuffer, 'source_hash'));
  const dummySource = bytesource.length === sourceLength ? bytesource :  ' '.repeat(sourceLength);
  const script = new vm.Script(dummySource, {
    filename: filename,
    cachedData: byteBuffer
  });

  if (script.cachedDataRejected) {
    throw new Error('cannot load bytecode, check node version');
  }
  return script;
}

export function execByteCode(filename:string) {
  const script = loadBytecode(filename);
  return script.runInThisContext();
}

(_module as any)._extensions['.bytecode'] = function loadModule(module: any, filename:string) {
  const wrapperFn = execByteCode(filename);
  const require = makeRequireFunction(module);
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
};
