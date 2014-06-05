'use strict';

var net = require('net');
var config = require('../config');
var parseMessage = require('./parseMessage');
var client;

function write(message) {
    try {
        client.write(message);
    } catch (error) {
        console.log('Could not reach control server.', error);
    }
}

exports.connect = function(socket) {
    client = net.connect({
            port: config.CONTROL_SERVER_PORT
        },
        function() {
            console.log('Control server connected', socket.id);
            socket.emit('info', 'Foobar web server connection established.');
        }
    );

    client.setKeepAlive(true, 10000);

    client.on('data', function(data) {
        var message = parseMessage.parseControlData(data.toString('utf-8'));
        if (message.status) {
            socket.emit('foobarStatus', message.status);
        }
        if (message.info) {
            socket.emit('info', message.info);
        }
    });

    client.on('end', emitErrorToClient);
    client.on('error', emitErrorToClient);

    function emitErrorToClient(error) {
        console.log('Connection to control server was closed. Foobar2000 was possibly closed.', socket.id, error);
        socket.emit('controlServerError', 'Connection to Foobar control server ended.');
    }
};

exports.sendCommand = function(command) {
    write(command + '\r\n');
    console.log('Control server command sent for action %s', command);
};

exports.endConnection = function() {
    client.end();
};

exports.write = write;
