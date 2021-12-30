const sub = require('./sub/index');

sub.arrowFunction(1);
const text = sub.readTextFile();
if (!text) {
  throw new Error('no text');
}

const foo = new sub.myClass(999);
foo.inc();

if (foo.getValue() !== 1000) {
  throw new Error('value is not 1000');
}

(async function() {
  try {
    await sub.asyncArrowException();
  } catch(e) {}
})();
