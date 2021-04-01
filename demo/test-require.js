require('./hook-require');
const hello = require('./hello-export.bytecode');

console.log(hello);

hello.sayHello(['required']);
