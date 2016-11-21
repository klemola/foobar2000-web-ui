const io = require('socket.io');
const controlServer = require('./foobarControlServer');
const foobarCommand = require('./foobarShellCommand');

function volumeCommand(command) {
    if (command.indexOf('vol') !== -1) {
        return 'vol ' + command.substring(3);
    } else if (command === 'mute') {
        return 'vol ' + 'mute';
    }

    return false;
}

function processCommand(command, socket) {
    const vol = volumeCommand(command);

    console.log('COMMAND RECEIVED, command: %s', command);
    if (vol) {
        controlServer.sendCommand(vol);
    } else if (command === 'launchFoobar') {
        foobarCommand.launchFoobar();
        setTimeout(function() {
            socket.emit('foobarStarted');
            socket.broadcast.emit('foobarStarted');
        }, 3000);
    } else {
        foobarCommand.sendCommand(command);
    }
}

function newConnection(socket) {
    controlServer.connect(socket);

    socket.on('disconnect', function() {
        console.log('Web client disconnected', socket.id);
        controlServer.endConnection();
    });

    socket.on('updateStatus', function() {
        console.log('updateStatus command received from client');
        controlServer.write('trackinfo' + '\r\n');
    });

    socket.on('foobarCommand', function(command) {
        processCommand(command, socket);
    });

    socket.on('resetControlServer', function() {
        controlServer.connect(socket);
    });
}

function configure(server) {
    const sio = io.listen(server, {
        'log level': 2,
    });

    sio.sockets.on('connection', newConnection);
    return sio;
};

exports.configure = configure;