var net = require('net');
var config = require('../config.js');

var client;
var io;
var VOLUME_CODE = 222;
var INFO_CODE = 999;
var statusCodes = {
    'playing': 111,
    'stopped': 112,
    'paused': 113
};

function getStatusNameByCode(code) {
    for (var status in statusCodes) {
        if (statusCodes[status] === code) {
            return status;
        }
    }
}

function parseControlData(text) {
    var lines;
    var parsedData = {};

    lines = text.split('\r\n');
    lines.forEach(function(item) {
        var messageCode = parseInt(item.substring(0, 3), 10);
        var status = getStatusNameByCode(messageCode);

        if (status) {
            parsedData.status = parseTrackData(item);
            parsedData.status.state = status;
        } else if (messageCode === VOLUME_CODE) {
            parsedData.status = {
                volume: item.split('|')[1]
            };
        } else if (messageCode === INFO_CODE) {
            parsedData.info += item + '\n';
        }
    });

    return parsedData;
}

function parseTrackData(text) {
    var attributes = text.split('|');
    var statusFields = config.controlServerStatusFields;
    var trackData = {};

    attributes.forEach(function(item, iter) {
        var attribute = statusFields[iter];
        if (attribute) {
            trackData[attribute] = item;
        }
    });

    return trackData;
}

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
        var message = parseControlData(data.toString('utf-8'));
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
