/**
 * Node module for use in node js
 * */

var path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

const COMMAND_IGRAPH = path.join(__dirname, '../../../igraph-cmd');

function LayoutCalculator(dataJson) {
    if (!dataJson) return callback(new Error('Data JSON not defined!'));

    try {
        if (typeof dataJson == 'string' || dataJson instanceof String) {
            dataJson = JSON.parse(dataJson);
        }
    } catch (c) {
        return callback(new Error('Invalid data json provided!'));
    }

    if (!dataJson.nodes) return callback(new Error('Nodes not defined!'));

    if (!dataJson.links) return callback(new Error('Links not defined!'));

    this.tempInFile = path.join(__dirname, '../temp', +new Date() + '_' + (Math.random() * 100000) + '.el');

    this.tempOutFile = path.join(__dirname, '../temp', +new Date() + '_' + (Math.random() * 100000) + '.json');

    this.data = dataJson;

    console.log('Work files:', this.tempInFile, this.tempOutFile);

}

LayoutCalculator.prototype.calculateLayout = function (callback) {
    var _this = this;

    this._prepareInFile(function (err) {
        if (err) return callback(err);
        _this._runCommand(function (err) {
            if (err) return callback(err);
            _this._mergeOutput(function (err) {
                if (err) return callback(err);
                fs.unlinkSync(_this.tempInFile);
                fs.unlinkSync(_this.tempOutFile);
                callback(null, _this.data);
            })
        });
    });
};

LayoutCalculator.prototype._prepareInFile = function (callback) {
    try {
        var fd = fs.openSync(this.tempInFile, 'w');
        this.data.links.forEach(function (link) {
            fs.writeSync(fd, link.source + " " + link.target + "\n");
        });
        fs.closeSync(fd);
        callback();
    } catch (c) {
        callback(new Error(c));
    }
};

LayoutCalculator.prototype._runCommand = function (callback) {
    var iGraph = spawn(COMMAND_IGRAPH, [this.tempInFile, this.tempOutFile], {
        env: process.env,
        cwd: path.join(__dirname, '../../../')
    });

    var hasExited = false;

    iGraph.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    iGraph.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        if (!hasExited) {
            hasExited = true;
            callback(data);
        }
    });

    iGraph.on('close', function (code) {
        console.log('child process exited with code ' + code);
        if (!hasExited) {
            hasExited = true;
            callback(null, code);
        }
    });
};

LayoutCalculator.prototype._mergeOutput = function (callback) {
    var result = require(this.tempOutFile),
        _this = this;
    result.forEach(function (position) {
        _this.data.nodes[position.ref].x = position.x;
        _this.data.nodes[position.ref].y = position.y;
    });
    callback();
};

exports.LayoutCalculator = LayoutCalculator;