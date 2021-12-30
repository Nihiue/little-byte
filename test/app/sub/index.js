const path = require('path');
const fs = require('fs');

function sayHello(more = []) {
  console.log(['Hello', 'Byte Code', ...more].join(', '));
}

class myClass {
  constructor(v = 0) {
    this.value = v;
  }
  inc() {
    this.value += 1;
  }
  getValue() {
    return this.value;
  }
};

module.exports.sayHello = sayHello;

module.exports.stringExport = "foobar";

module.exports.asyncArrowException = async () => {
  undefined();
}
module.exports.arrowFunction = (a) => a + 1;

module.exports.myClass = myClass;

module.exports.readTextFile = function () {
  return fs.readFileSync(path.join(__dirname, 'textfile.txt'), 'utf-8');
}

module.exports.stackTrace = function () {
  return (new Error()).stack;
}
