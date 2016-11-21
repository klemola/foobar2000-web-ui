const net = require('net');
const config = require('../config');
const parseMessage = require('./parseMessage');

let client;

function emitErrorToClient(socket) {
    return (error) => {
        console.log('Connection to control server was closed. Foobar2000 was possibly closed.', socket.id, error);
        socket.emit('controlServerError', 'Connection to Foobar control server ended.');
    };
}

function onData(socket) {
    return (data) => {
        const message = parseMessage.parseControlData(data.toString('utf-8'));
    
        if (message.status) {
            socket.emit('foobarStatus', message.status);
        }

        if (message.info) {
            socket.emit('info', message.info);
        }
    };
}

function write(message) {
    try {
        client.write(message);
    } catch (error) {
        console.log('Could not reach control server.', error);
    }
}

function connect(socket) {
    client = net.connect({
            port: config.controlServerPort
        },
        () => {
            console.log('Control server connected', socket.id);
            socket.emit('info', 'Foobar web server connection established.');
        }
    );

    client.setKeepAlive(true, 10000);

    client.on('data', onData(socket));
    client.on('end', emitErrorToClient(socket));
    client.on('error', emitErrorToClient(socket));
};

function sendCommand(command) {
    write(command + '\r\n');
    console.log('Control server command sent for action %s', command);
};

function endConnection() {
    client.end();
};

exports.connect = connect;
exports.sendCommand = sendCommand;
exports.write = write;
exports.endConnection = endConnection;
