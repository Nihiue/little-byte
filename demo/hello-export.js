function sayHello(more = []) {
  console.log(['Hello', 'Byte Code', ...more].join(', '));
}

sayHello();

module.exports.sayHello = sayHello;
module.exports.stringExport = "foobar";