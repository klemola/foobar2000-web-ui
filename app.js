var express = require('express');
var routes = require('./src/routes.js');
var foobarControlServer = require('./src/foobarControlServer.js');
var PORT = require('./config.js').WEB_SERVER_PORT;

// -------- CONFIG ---------
var app = express();
var server = require('http').createServer(app);

app.configure(function(){
    app.set('views', __dirname + '/src/templates');
    app.set('view engine', 'jade');
    app.set('view options', { pretty: true });

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compress());
    app.use(express.static(__dirname + '/src/static'));
    app.use(app.router);

    app.locals.pretty = true;
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// -------- START SERVER ---------
server.listen(PORT);
foobarControlServer.initialize(server);
console.log('Server listening on port %d', PORT);

// -------- DEFINE ROUTES ---------
app.get('/', routes.index);
app.post('/command', routes.command);