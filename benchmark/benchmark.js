

const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log('Total Time: ', items.getEntries()[0].duration);
  obs.disconnect();
});

obs.observe({ entryTypes: ['function'] });

if (process.argv[2] === 'js') {
  console.log('Source Code');
  performance.timerify(function () {
    require('./cli');
  })();
} else {
  console.log('Bytecode');
  performance.timerify(function () {
    require('../demo/hook-require');
    require('./cli.bytecode');
  })();
}