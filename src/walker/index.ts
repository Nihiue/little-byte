import * as path from 'path';
import * as fs from 'fs';
import { compileFile } from '../compiler/index';

type WalkAction = 'ignore' | 'compile' | 'copy';

type FileInfo = {
  path: string;
  relativePath: string;
  name: string;
  ext: string;
  isScript: boolean;
};

interface WalkOptions {
  inputDir: string;
  outputDir: string;
  onFile: (fileinfo: FileInfo, defaultAction: WalkAction) => WalkAction;
};

async function ensureDir(dirPath:string) {
  try {
    await fs.promises.stat(dirPath);
  } catch (e) {
    await fs.promises.mkdir(dirPath, {
      recursive: true
    });
  }
}

async function processFile(fileInfo: FileInfo, action: WalkAction, outputDir: string) {
  const targetDir = path.dirname(path.join(outputDir, fileInfo.relativePath));
  switch(action) {
    case 'copy':
      console.log(` - Copy: ${fileInfo.relativePath}`);
      await ensureDir(targetDir);
      await fs.promises.copyFile(fileInfo.path, path.join(targetDir, fileInfo.name));
      break;
    case 'ignore': 
      break;
    case 'compile':
      console.log(` - Compile: ${fileInfo.relativePath}`);
      await ensureDir(targetDir);
      await compileFile(fileInfo.path, targetDir);
      break;
    default:
      throw new Error(`little-byte: invalid action ${action} for file ${fileInfo.relativePath}`);
  }
}

export async function start({ inputDir, outputDir, onFile }: WalkOptions) {
  const dirs:string[] = [ inputDir ];

  let currentDir;
  while (currentDir = dirs.shift()) {
    const files = await fs.promises.readdir(currentDir, {
      withFileTypes: true
    });
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const currentPath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        dirs.push(currentPath);
        continue;
      }
      const fileInfo: FileInfo = {
        path: currentPath,
        relativePath: path.relative(inputDir, currentPath),
        name: file.name,
        ext: path.extname(file.name).toLowerCase(),
        isScript: false
      };
      fileInfo.isScript =  fileInfo.ext === '.js';
      let action: WalkAction = fileInfo.isScript ? 'compile' : 'ignore';
     
      try {
        action = onFile(Object.freeze(fileInfo), action);
        if (!fileInfo.isScript && action === 'compile') {
          throw new Error(`little-byte: cannot compile non-js file: ${fileInfo.relativePath}`);
        }
        await processFile(fileInfo, action || 'ignore', outputDir);
      } catch (e) {
        console.log(e);
      }
    }
  }
}