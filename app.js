var express = require('express');
var indexPage = require('./src/indexPage');
var foobarCommand = require('./src/foobarShellCommand');
var websocketServer = require('./src/websocketServer');
var config = require('./config');

var app = express();
var server = require('http').createServer(app);

require('./src/configureServer')(app, express);
app.get('/', indexPage);

if (config.startFoobar2000Automatically) {
    foobarCommand.launchFoobar();
}

server.listen(config.WEB_SERVER_PORT);
websocketServer(server);
console.log('Server listening on port %d', config.WEB_SERVER_PORT);
