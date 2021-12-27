function sayHello(more = []) {
  console.log(['Hello', 'Byte Code', ...more].join(', '));
}

sayHello();
