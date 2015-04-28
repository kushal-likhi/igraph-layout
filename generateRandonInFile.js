const MAX_NODES = 5000;
const CONNECTIONS_PER_NODE_MAX = 1000;
const FILE_NAME = 'generated.txt';
var fs = require('fs');
var fd = fs.openSync(FILE_NAME, 'w');

for (var i = 0; i < MAX_NODES; i++) {
    var numConnections = ~~(Math.random() * CONNECTIONS_PER_NODE_MAX);
    var connected = {};
    console.log(i, numConnections);
    for (var j = 0; j < numConnections; j++) {
        var friend = ~~(Math.random() * MAX_NODES);
        if (!connected[friend]) {
            connected[friend] = true;
            fs.writeSync(fd, "" + i + " " + friend + '\n');
        }
    }
}

fs.closeSync(fd);