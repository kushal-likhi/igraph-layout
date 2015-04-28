var lib = require('./');

lib.selfTest(function (err, passed) {
    console.log(err, passed);
});

var ts = +new Date();

var lc = new lib.LayoutCalculator(require('./.tmp/Kushal-raw.json')); //this file not pushed

lc.calculateLayout(function (err, data) {
    console.log(err);
    console.log('Time:', (+new Date() - ts) / 1000, 'Seconds');
    require('fs').writeFileSync('./.tmp/Kushal-raw.modified.json', JSON.stringify(data));
});