const express = require('express');

const foobarCommand = require('./src/foobarShellCommand');
const websocketServer = require('./src/websocketServer');
const configureServer = require('./src/configureServer');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);

if (config.startFoobar2000Automatically) {
    foobarCommand.launchFoobar();
}

configureServer.configure(app);
server.listen(config.WEB_SERVER_PORT);
websocketServer(server);
console.log('Server listening on port %d', config.WEB_SERVER_PORT);
