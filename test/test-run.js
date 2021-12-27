require('../lib/index');
const hello = require('./output/hello-export');

console.log(hello.sayHello.toString());

hello.sayHello(['required']);
console.log(hello.class.toString());
// hello.asyncArrow();

