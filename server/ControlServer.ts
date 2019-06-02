import * as Net from 'net'
import * as Bunyan from 'bunyan'
import { Context } from './Models'

const connectionError = new Error('Could not connect to control server')

export function probe(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const sock = new Net.Socket()

        sock.setTimeout(10000)

        sock.on('connect', () => {
            sock.destroy()
            return resolve()
        })

        sock.on('error', () => reject(connectionError))

        sock.on('timeout', () => reject(connectionError))

        sock.connect(port, '127.0.0.1')
    })
}

export function connect(port: number, logger: Bunyan): Promise<Net.Socket> {
    return new Promise(resolve => {
        const client: Net.Socket = Net.connect({ port }, () => {
            client.setKeepAlive(true, 10000)

            client.on('end', () => {
                // TODO: reconnect automatically
                logger.info('Control server closed connection')
            })

            client.on('error', e => {
                logger.warn('Error in control server connection')
                logger.error(e)
            })

            return resolve(client)
        })
    })
}

export function sendCommand(ctx: Context, command: string) {
    try {
        ctx.client.write(`${command}\r\n`)
        ctx.logger.info(`Control server command sent for action ${command}`)
    } catch (error) {
        ctx.logger.warn('Could not reach control server')

        if (error) {
            ctx.logger.error(error)
        }
    }
}
