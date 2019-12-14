import * as Net from 'net'

import { Context } from './Models'
import { Logger } from 'Logger'

const connectionError = new Error('Could not connect to control server')

export function probe(port: number): Promise<void> {
    const sock = new Net.Socket()
    let retriesLeft = 3

    sock.setTimeout(5000)

    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            retriesLeft = retriesLeft - 1

            if (retriesLeft === 0) {
                return reject(connectionError)
            }

            return setTimeout(() => sock.connect(port, '127.0.0.1'), 1000)
        }

        sock.on('connect', () => {
            sock.destroy()
            return resolve()
        })

        sock.on('error', tryConnect)
        sock.on('timeout', () => tryConnect)

        tryConnect()
    })
}

export function connect(port: number, logger: Logger): Promise<Net.Socket> {
    const onConnectionError = (socket: Net.Socket) => (e: Error) => {
        logger.warn('Error in control server connection', e)
        socket.destroy()
        process.exit(1)
    }

    return new Promise(resolve => {
        const client: Net.Socket = Net.connect({ port }, () => {
            client.setKeepAlive(true, 10000)

            client.on('end', onConnectionError(client))
            client.on('error', onConnectionError(client))

            return resolve(client)
        })
    })
}

export function sendCommand(ctx: Context, command: string) {
    try {
        ctx.client.write(`${command}\r\n`)
        ctx.logger.debug(`Control server command sent for action ${command}`)
    } catch (error) {
        ctx.logger.warn('Could not reach control server')

        if (error) {
            ctx.logger.error(error)
        }
    }
}
