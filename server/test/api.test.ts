import { assert } from 'chai'
import * as path from 'path'
import bunyan from 'bunyan'
import * as net from 'net'
import { describe } from 'mocha'

const socketioClient: any = require('socket.io-client')
const _: any = require('lodash')

import { createServer } from './MockControlServer'
import * as Server from '../Server'
import * as ControlServer from '../ControlServer'
import { mockTrack1 } from './fixtures'
import { TrackInfo, Context } from '../Models'
import * as config from '../config'

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

    before(done => {
        const _config = {
            ...config,
            controlServerPort: testControlServerPort
        }
        const logger = bunyan.createLogger({
            name: 'foobar2000-web-ui-test',
            serializers: bunyan.stdSerializers,
            streams: [
                {
                    path: `${path.resolve(__dirname, '..')}/test.log`
                }
            ]
        })
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
        const ioClient = socketioClient(
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
        const ioClient = socketioClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const receivedData = []

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
