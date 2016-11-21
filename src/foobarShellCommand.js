const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const config = require('../config');

const foobarPath = path.normalize(config.foobarPath) + "/";
const opts = { cwd: foobarPath };

if (fs.readdirSync(foobarPath).indexOf('foobar2000.exe') === -1) {
    throw 'Foobar2000.exe was not found in the path specified in config.js';
}

function sendCommand(command) {
    const foobarCommand = 'foobar2000.exe /' + command;

    exec(foobarCommand, opts);
};

function launchFoobar() {
    exec('foobar2000.exe', opts);
};

exports.sendCommand = sendCommand;
exports.launchFoobar = launchFoobar;