const ChildProcess = require('child_process')
const Fs = require('fs');
const Path = require('path');
const Message = require('./Message');
const ControlServer = require('./ControlServer');

function launch(foobarPath) {
    const normalizedPath = Path.normalize(foobarPath) + "/";
    
    if (Fs.readdirSync(normalizedPath).indexOf('foobar2000.exe') === -1) {
        throw 'Foobar2000.exe was not found in the path specified in configuration';
    }

    return new Promise((resolve, reject) => {
        ChildProcess.exec('foobar2000.exe', { cwd: foobarPath });
        setTimeout(() => resolve(true), 2000);
    })
};

function queryTrackInfo(ctx) {
    return ControlServer.sendCommand(ctx, 'trackinfo'); 
}

function sendCommand(ctx, io, command) {
    ctx.logger.info({ command }, 'Command received');

    if (command === 'launchFoobar') {
        return launch(ctx.config.foobarPath)
            .then(() => {
                io.sockets.emit('foobarStarted');
            });
    }

    if (command === 'mute') {
        return ControlServer.sendCommand(ctx, 'vol mute');  
    }

    if (command.indexOf('vol') !== -1) {
        return ControlServer.sendCommand(ctx, `vol ${command.substring(3)}`);
    }  

    return ChildProcess.exec(`foobar2000.exe /${command}`, {cwd: ctx.config.foobarPath});
}

function onData(ctx, io) {
    return function controlDataHandler(data) {
        const messages = Message.parseControlData(data.toString('utf-8'));

        ctx.logger.info(messages, 'Received data from control server');

        messages.forEach(message => {
            if (message.type === 'statusChange') {
                io.sockets.emit('foobarStatus', message.status);
            }

            if (message.type === 'info') {
                io.sockets.emit('info', message.content);
            }
        });
    };
}

exports.launch = launch;
exports.queryTrackInfo = queryTrackInfo;
exports.sendCommand = sendCommand;
exports.onData = onData;
