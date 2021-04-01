function validateString(value, name) {
  if (typeof value !== 'string') {
    throw new Error(`${name} is not string`);
  }
}

function makeRequireFunction(mod) {
  // see node.js lib/internal/modules/cjs/helpers.js
  const Module = mod.constructor;

  const require = function require(path) {
    return mod.require(path);
  };

  require.resolve = function resolve(request, options) {
    validateString(request, 'request');
    return Module._resolveFilename(request, mod, false, options);
  }

  require.resolve.paths = function paths(request) {
    validateString(request, 'request');
    return Module._resolveLookupPaths(request, mod);
  };

  require.main = process.mainModule;
  require.extensions = Module._extensions;
  require.cache = Module._cache;

  return require;
}

module.exports = makeRequireFunction;
