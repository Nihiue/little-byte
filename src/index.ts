const supportVersions = ['v12', 'v13', 'v14', 'v15', 'v16'];
if (!supportVersions.some(v => process.version.startsWith(v))) {
  throw new Error('bytecode: unsupported node version');
}

import * as compiler from './compiler/index';
import * as loader from './loader/index';
import * as walker from './walker/index';
export default {
  compiler,
  loader,
  walker
};