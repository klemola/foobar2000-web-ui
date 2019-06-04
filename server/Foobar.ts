import * as child_process from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as net from 'net'

import * as Message from './Message'
import * as ControlServer from './ControlServer'
import { Context } from './Models'

export function launch(config: any): Promise<net.Server | void> {
    if (os.platform() !== 'win32') {
        const MockControlServer = require('./test/MockControlServer')
        return new Promise(resolve =>
            resolve(
                MockControlServer.createServer(
                    '127.0.0.1',
                    config.controlServerPort
                )
            )
        )
    }

    const normalizedPath = `${path.normalize(config.foobarPath)}/`

    if (fs.readdirSync(normalizedPath).indexOf('foobar2000.exe') === -1) {
        throw new Error(
            'Foobar2000.exe was not found in the path specified in configuration'
        )
    }

    // TODO: handle process termination gracefully
    child_process.exec('foobar2000.exe', { cwd: config.foobarPath })
    return ControlServer.probe(config.controlServerPort)
}

export function queryTrackInfo(ctx: Context) {
    return ControlServer.sendCommand(ctx, 'trackinfo')
}

export function sendCommand(
    ctx: Context,
    io: SocketIO.Server,
    command: string
) {
    ctx.logger.info('Command received', { command })

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

    return child_process.exec(`foobar2000.exe /${command}`, {
        cwd: ctx.config.foobarPath
    })
}

export function onData(ctx: Context, io: SocketIO.Server) {
    return function controlDataHandler(data: Buffer) {
        const messages = Message.parseControlData(data.toString('utf-8'))

        ctx.logger.info('Received data from control server', messages)

        messages.forEach(message => {
            if (message.type === 'playback' || message.type === 'volume') {
                io.sockets.emit('foobarStatus', message.data)
            }

            if (message.type === 'info') {
                io.sockets.emit('info', message.data)
            }
        })
    }
}
