import { assert } from 'chai'
import * as net from 'net'
import { describe } from 'mocha'
import SocketIOClient from 'socket.io-client'

import { createServer } from '../MockControlServer'
import * as Server from '../Server'
import * as ControlServer from '../ControlServer'
import { mockTrack1 } from './fixtures'
import { TrackInfo, Context, Env } from '../Models'
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
                    client,
                    instance: null
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

    // TODO improve test
    it('should send foobar2000 playback info when a playback action is triggered', done => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const receivedData: any[] = []

        ioClient.on('foobarStatus', (data: any) => {
            receivedData.push(data)
        })

        ioClient.emit('foobarCommand', 'stop')

        setTimeout(() => {
            const playbackMessage = receivedData[2]

            assert.ok(receivedData.length === 4)
            assert.ok(playbackMessage.status && playbackMessage.status === 112)

            ioClient.disconnect()
            done()
        }, 100)
    })

    // TODO improve test
    it('should send foobar2000 status info when volume is changed', done => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const receivedData: any[] = []

        ioClient.on('foobarStatus', (data: any) => {
            receivedData.push(data)
        })

        ioClient.emit('foobarCommand', 'vol mute')

        setTimeout(() => {
            const volMessage = receivedData[3]

            assert.ok(receivedData.length === 4)
            assert.ok(volMessage.volume && volMessage.volume === 'muted')

            ioClient.disconnect()
            done()
        }, 100)
    })
})
