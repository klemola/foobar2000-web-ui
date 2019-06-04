import { assert } from 'chai'
import * as net from 'net'
import { describe } from 'mocha'
import SocketIOClient from 'socket.io-client'

const _: any = require('lodash')

import { createServer } from './MockControlServer'
import * as Server from '../Server'
import * as ControlServer from '../ControlServer'
import { mockTrack1 } from './fixtures'
import { TrackInfo, Context, Message, Env } from '../Models'
import config from '../config'
import * as Logger from '../Logger'

const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
}
const testControlServerPort = 6666
const testServerPort = 9999

describe('API', () => {
    let mockControlServer: net.Server
    let testServer: any
    let ioInstance: SocketIO.Server
    let environment: Env = 'test'

    before(done => {
        const _config = {
            ...config,
            controlServerPort: testControlServerPort,
            environment
        }
        const logger = Logger.create(_config.environment)
        mockControlServer = createServer('127.0.0.1', testControlServerPort)

        ControlServer.connect(_config.controlServerPort, logger).then(
            client => {
                const context: Context = {
                    config: _config,
                    logger,
                    client
                }

                const { server, io } = Server.create()
                Server.configureWebsockets(context, io)

                ioInstance = io
                testServer = server
                testServer.listen(testServerPort)
                done()
            }
        )
    })

    after(() => {
        mockControlServer.close()
        testServer.close()
    })

    it('should initialize', done => {
        assert.ok(ioInstance !== null)
        done()
    })

    it('should send foobar2000 status info upon connecting ', done => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        ioClient.on('foobarStatus', (data: TrackInfo) => {
            assert.ok(data.state === mockTrack1.state)
            assert.ok(data.track === mockTrack1.track)

            ioClient.disconnect()
            done()
        })
    })

    it('should send foobar2000 status info when volume is changed', done => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const receivedData: Message[] = []

        ioClient.on('foobarStatus', (data: any) => {
            receivedData.push(data)
        })

        ioClient.emit('foobarCommand', 'vol mute')

        setTimeout(() => {
            assert.ok(receivedData.length === 2)
            ioClient.disconnect()
            done()
        }, 100)
    })
})
