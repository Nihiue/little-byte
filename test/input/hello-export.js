function sayHello(more = []) {
  console.log(['Hello', 'Byte Code', ...more].join(', '));
}
class myClass {
  foo() {}
  bar(b) {
    return b + 1;
  }
};
sayHello();

module.exports.sayHello = sayHello;
module.exports.stringExport = "foobar";
module.exports.asyncArrow = async () => {
  undefined();
}
module.exports.arrow = (a) => a + 1;

module.exports.class = myClass;