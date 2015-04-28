const MAX_NODES = 1000;
const CONNECTIONS_PER_NODE_MAX = 1000;
const FILE_NAME = 'generated.txt';

var ws = require('fs').createWriteStream(FILE_NAME);

for (var i = 0; i < MAX_NODES; i++) {
    var numConnections = ~~(Math.random() * CONNECTIONS_PER_NODE_MAX);
    var connected = {};
    console.log(i, numConnections);
    for (var j = 0; j < numConnections; j++) {
        var friend = ~~(Math.random() * MAX_NODES);
        if (!connected[friend]) {
            connected[friend] = true;
            ws.write("" + i + " " + friend + '\n');
        }
    }
}

setInterval(function(){
    console.log(ws.bytesWritten);
}, 1000);