var controlServer = require('./foobarControlServer');
var foobarCommand = require('./foobarShellCommand');
var io = require('socket.io');

module.exports = function(server) {
    var sio = io.listen(server, {
        'log level': 2
    });

    sio.sockets.on('connection', newConnection);
    return sio;
};

function newConnection(socket) {
    controlServer.startConnection(socket);

    socket.on('disconnect', function() {
        console.log('Web client disconnected', socket.id);
        controlServer.endConnection();
    });

    socket.on('updateStatus', function() {
        console.log('updateStatus command received from client');
        controlServer.write('trackinfo' + '\r\n');
    });

    socket.on('foobarCommand', processCommand);
}

function processCommand(command) {
    var vol = volumeCommand(command);

    console.log('COMMAND RECEIVED, command: %s', command);
    if (vol) {
        controlServer.sendCommand(vol);
    } else if (command === 'launchFoobar') {
        foobarCommand.launchFoobar();
    } else {
        foobarCommand.sendCommand(command);
    }
}

function volumeCommand(command) {

    if (command.indexOf('vol') !== -1) {
        return 'vol ' + command.substring(3);
    } else if (command === 'mute') {
        return 'vol ' + 'mute';
    }

    return false;
}
