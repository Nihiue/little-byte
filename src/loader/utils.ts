import * as vm from 'vm';

const HeaderOffsetMap = {
  'magic': 0,
  'version_hash': 4,
  'source_hash': 8,
  'flag_hash': 12
};

type headerType = keyof (typeof HeaderOffsetMap);

export const headerUtils = {
  set(targetBuffer: Buffer, type: headerType, sourceBuffer: Buffer) {
    sourceBuffer.copy(targetBuffer, HeaderOffsetMap[type]);
  },
  get(buffer: Buffer, type: headerType) {
    const offset = HeaderOffsetMap[type];
    return buffer.slice(offset, offset + 4);
  },
  buf2num(buf: Buffer) {
    // 注意字节序问题
    let ret = 0;
    ret |= buf[3] << 24;
    ret |= buf[2] << 16;
    ret |= buf[1] << 8;
    ret |= buf[0];
    return ret;
  }
};

let _flag_buf: Buffer | undefined;

export function getReferenceFlagHash() {
  if (!_flag_buf) {
    const script = new vm.Script('');
    _flag_buf = headerUtils.get(script.createCachedData(), 'flag_hash');
  }
  return _flag_buf;
}

function validateString(value: string, name: string) {
  if (typeof value !== 'string') {
    throw new Error(`${name} is not string`);
  }
}

export function makeRequireFunction(mod: NodeJS.Module) {
  // see node.js lib/internal/modules/cjs/helpers.js
  const Module: any = mod.constructor;

  const require = function require(path: string) {
    return mod.require(path);
  };

  require.resolve = function resolve(request: string, options: any) {
    validateString(request, 'request');
    return Module._resolveFilename(request, mod, false, options);
  } as any;

  require.resolve.paths = function paths(request: string) {
    validateString(request, 'request');
    return Module._resolveLookupPaths(request, mod);
  };

  require.main = process.mainModule;
  require.extensions = Module._extensions;
  require.cache = Module._cache;

  return require;
}
