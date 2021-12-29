import { parse } from '@babel/parser';
const FUNC_TYPES = [
  'ArrowFunctionExpression',
  'FunctionDeclaration',
  'FunctionExpression',
  'ClassDeclaration',
  'ClassMethod',
];

const isNode = (t: any) => (t && t.constructor.name === 'Node');

function walkNode(root: any, codeStr:string) {
  const ret:[number, string][] = [];
  const todo = [root];
  let node: any;
  while (node = todo.shift()) {
    if (FUNC_TYPES.indexOf(node.type) > -1) {
      if (node.body.type === 'BlockStatement' || node.body.type === 'ClassBody') {
        ret.push([node.start, codeStr.slice(node.start, node.body.start + 1)]);
        ret.push([node.body.end - 1, codeStr.slice(node.body.end - 1, node.body.end)]);
      } else {
        ret.push([node.start, codeStr.slice(node.start, node.body.start)]);
      }
    }
    Object.keys(node).forEach(k => {
      const item = node[k];
      if (item && item.forEach) {
        item.forEach((t: any) => (isNode(t) && todo.push(t)));
      } else if (isNode(item)) {
        todo.push(item);
      }
    });
  }
  return ret;
}

function padString(len:number) {
  return len <= 0 ? '' : (' '.repeat(len));
}

function findLineBreaks(codeStr:string) {
  const lineBreaks:[number, string][] = [];
  let lastBr = -1;
  while (true) {
    lastBr = codeStr.indexOf('\n', lastBr + 1);
    if (lastBr === -1) {
      return lineBreaks;
    }
    lineBreaks.push([lastBr, '\n']);
  }
}

function generateSource(tokens: [number, string][], targetLength: number) {
  const ret = [];
  let len = 0;

  tokens.forEach(([start, content]) => {
    if (len < start) {
      ret.push(padString(start - len));
      len = start;
    }
    ret.push(content);
    len += content.length;
  });
  if (len < targetLength) {
    ret.push(padString(targetLength - len));
  }
  return ret.join('');
}

export default function getByteSource (codeStr:string) {
  const ast = parse(codeStr);
  const tokens = walkNode(ast.program.body, codeStr)
    .concat(findLineBreaks(codeStr))
    .sort((a, b) => a[0] - b[0]);
  return generateSource(tokens, codeStr.length);
};