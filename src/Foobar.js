const ChildProcess = require('child_process')
const Fs = require('fs')
const Path = require('path')
const Message = require('./Message')
const ControlServer = require('./ControlServer')

function launch(config) {
    const normalizedPath = `${Path.normalize(config.foobarPath)}/`

    if (Fs.readdirSync(normalizedPath).indexOf('foobar2000.exe') === -1) {
        throw new Error(
            'Foobar2000.exe was not found in the path specified in configuration'
        )
    }

    // TODO: handle process termination gracefully
    ChildProcess.exec('foobar2000.exe', { cwd: config.foobarPath })
    return ControlServer.probe(config.controlServerPort)
}

function queryTrackInfo(ctx) {
    return ControlServer.sendCommand(ctx, 'trackinfo')
}

function sendCommand(ctx, io, command) {
    ctx.logger.info({ command }, 'Command received')

    if (command === 'launchFoobar') {
        return launch(ctx.config)
            .then(() => io.sockets.emit('foobarStarted'))
            .catch(() => {
                ctx.logger.warn('Could not launch Foobar')
                io.sockets.emit('controlServerError', 'Could not launch Foobar')
            })
    }

    if (command === 'mute') {
        return ControlServer.sendCommand(ctx, 'vol mute')
    }

    if (command.indexOf('vol') !== -1) {
        return ControlServer.sendCommand(ctx, `vol ${command.substring(3)}`)
    }

    return ChildProcess.exec(`foobar2000.exe /${command}`, {
        cwd: ctx.config.foobarPath
    })
}

function onData(ctx, io) {
    return function controlDataHandler(data) {
        const messages = Message.parseControlData(data.toString('utf-8'))

        ctx.logger.info(messages, 'Received data from control server')

        messages.forEach(message => {
            if (message.type === 'statusChange') {
                io.sockets.emit('foobarStatus', message.status)
            }

            if (message.type === 'info') {
                io.sockets.emit('info', message.content)
            }
        })
    }
}

exports.launch = launch
exports.queryTrackInfo = queryTrackInfo
exports.sendCommand = sendCommand
exports.onData = onData
