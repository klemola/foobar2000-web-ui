var net = require('net');
var config = require('../config.js');
var parseMessage = require('./parseMessage.js');

var client;
var io;

function startConnection(socket) {
    client = net.connect({
            port: config.CONTROL_SERVER_PORT
        },
        function() {
            console.log('Web client connected', socket.id);
            socket.emit('info', 'Foobar web server connection established.');
        }
    );

    client.on('data', function(data) {
        var message = parseMessage.parseControlData(data.toString('utf-8'));
        if (message.status) {
            socket.emit('foobarStatus', message.status);
        }
        if (message.info) {
            socket.emit('info', message.info);
        }
    });

    client.on('end', function() {
        socket.emit('info', 'Connection to Foobar control server ended.');
    });

    socket.on('disconnect', function() {
        console.log('Web client disconnected', socket.id);
        client.end();
    });

    socket.on('updateStatus', function() {
        console.log('updateStatus command received from client');
        client.write('trackinfo' + '\r\n');
    });
}

exports.sendCommand = function(command) {
    if (command.indexOf('vol') !== -1) {
        command = 'vol ' + command.substring(3);
    } else if (command === 'mute') {
        command = 'vol ' + 'mute';
    }
    console.log('Control server command sent for action', command);
    client.write(command + '\r\n');
};

exports.initialize = function(server) {
    io = require('socket.io').listen(server, {
        'log level': 2
    });
    io.sockets.on('connection', startConnection);
    return io;
};
