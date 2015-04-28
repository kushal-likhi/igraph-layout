#Igraph CMD Layout#

##Installation

1. Run `./configure.sh`
2. Run `./build.sh`

This should do the job.

use the binary `igraph-cmd <Input Edge list FIle> <Output position JSON file>`

##Node JS Bindings##
Has node js bindings to use it easily in a node project.

node module located at `thirdPartyBindings/nodejs`

```javascript
var igraph = require('./thirdPartyBindings/nodejs');

//Test if ll is good. (Can be done once on app load). Just for demo here.
igraph.selfTest(function (err, passed) {
    console.log(err, passed);
});


var ts = +new Date();

var lc = new igraph.LayoutCalculator(require('./.tmp/Kushal-raw.json')); //this file not pushed

lc.calculateLayout(function (err, data) {
    if(err) return console.log(err);

    //Log time taken
    console.log('Time:', (+new Date() - ts) / 1000, 'Seconds');

    //Just saving the output for demo purposes. Used sync for making demo clean.
    require('fs').writeFileSync('./.tmp/Kushal-raw.modified.json', JSON.stringify(data));
});
```