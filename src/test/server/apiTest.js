/* eslint-disable import/no-extraneous-dependencies */
const { assert } = require('chai')
const Path = require('path')
const Bunyan = require('bunyan')
const SocketIoClient = require('socket.io-client')
const _ = require('lodash/fp')
const MockControlServer = require('../util/MockControlServer')
const Server = require('../../Server')
const ControlServer = require('../../ControlServer')
const { mockTrack1 } = require('../fixtures')

const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
}
const testControlServerPort = 6666
const testServerPort = 9999

describe('API', () => {
    let mockControlServer
    let testServer
    let ioInstance

    before(done => {
        const config = _.merge(require('../../../Config'), {
            controlServerPort: testControlServerPort
        })
        const logger = Bunyan.createLogger({
            name: 'foobar2000-web-ui-test',
            serializers: Bunyan.stdSerializers,
            streams: [
                {
                    path: `${Path.resolve(__dirname, '..')}/test.log`
                }
            ]
        })
        mockControlServer = MockControlServer.createServer(
            '127.0.0.1',
            testControlServerPort
        )

        ControlServer.connect(config.controlServerPort, logger).then(client => {
            const context = {
                config,
                logger,
                client
            }

            const { server, io } = Server.createServer()
            Server.configureWebsockets(context, io)

            ioInstance = io
            testServer = server
            testServer.listen(testServerPort)
            done()
        })
    })

    after(() => {
        mockControlServer.close()
        testServer.close()
    })

    it('should initialize', done => {
        assert.deepEqual(ioInstance.engine.transports.sort(), [
            'polling',
            'websocket'
        ])
        done()
    })

    it('should send Foobar2000 status info upon connecting ', done => {
        const ioClient = SocketIoClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        ioClient.on('foobarStatus', data => {
            assert.ok(data.state === mockTrack1.state)
            assert.ok(data.track === mockTrack1.track)

            ioClient.disconnect()
            done()
        })
    })

    it('should send Foobar2000 status info when volume is changed', done => {
        const ioClient = SocketIoClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const receivedData = []

        ioClient.on('foobarStatus', data => {
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
