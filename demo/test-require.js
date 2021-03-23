require('./hook-require');
const hello = require('./hello.bytecode');

console.log(hello);

hello.sayHello(['required']);