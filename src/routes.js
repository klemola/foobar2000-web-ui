var APP_TITLE = 'Foobar2000 Webui';
var config = require('../config.js');
var foobarCommand = require('./foobarShellCommand.js');
var foobarControlServer = require('./foobarControlServer.js');

//temporary
var iconList = {
    'playpause': 'play',
    'stop': 'stop',
    'prev': 'step-backward',
    'next': 'step-forward',
    'rand': 'random'
};

// GET
exports.index = function(req, res) {
    res.render('index', {
        title: APP_TITLE,
        actions: config.foobarActions,
        icons: iconList,
        serverConfig: {
            'serverAddress': config.SERVER_EXTERNAL_IP,
            'port': config.WEB_SERVER_PORT
        }
    });
};

// POST
exports.command = function(req, res) {
    var action = req.body.action;
    var message = 'Foobar action ' + action;

    console.log('COMMAND RECEIVED, action:', action);
    if (action.indexOf('vol') !== -1 || action.indexOf('mute') !== -1) {
        foobarControlServer.sendCommand(action, handleResponse);
    } else {
        foobarCommand.sendCommand(action, handleResponse);
    }

    function handleResponse(error) {
        if (error) {
            message += ' failed.';
            console.log('Error executing foobar command: ' + error);
        } else {
            message += ' successful.';
        }

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(message);
    }
};