const express = require('express');

const foobarCommand = require('./foobarShellCommand');
const websocketServer = require('./websocketServer');
const configureServer = require('./configureServer');
const config = require('../config');

const app = express();
const server = require('http').createServer(app);

if (config.startFoobar2000Automatically) {
    foobarCommand.launchFoobar();
}

configureServer.configure(app);
websocketServer.configure(server);
server.listen(config.webServerPort);
console.log(`Server listening on port ${config.webServerPort}`);
