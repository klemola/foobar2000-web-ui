/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { assert } from 'chai'
import * as net from 'net'
import { describe } from 'mocha'
import SocketIOClient from 'socket.io-client'

import { createServer } from '../MockControlServer'
import * as Server from '../Server'
import * as ControlServer from '../ControlServer'
import { mockTrack1 } from './fixtures'
import {
    Context,
    Env,
    Message,
    PlaybackMessage,
    VolumeMessage,
    Config,
} from '../Models'
import * as Logger from '../Logger'

const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    autoConnect: false,
    reconnection: false,
}
const testControlServerPort = 6666
const testServerPort = 9999
const environment: Env = 'test'
const config: Config = {
    foobarPath: 'C:/tmp',
    webserverPort: testServerPort,
    controlServerPort: testControlServerPort,
    controlServerMessageSeparator: '|',
    environment,
}

describe('API', () => {
    let mockControlServer: net.Server
    let testServer: any
    let ioInstance: SocketIO.Server

    before((done) => {
        const logger = Logger.create(config.environment)
        mockControlServer = createServer('127.0.0.1', testControlServerPort)

        ControlServer.connect(config.controlServerPort, logger).then(
            (client) => {
                const context: Context = {
                    config: config,
                    logger,
                    client,
                    instance: null,
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

    it('should initialize', (done) => {
        assert.ok(ioInstance !== null)
        done()
    })

    it('should send foobar2000 status info upon connecting ', (done) => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const messages: Message[] = []

        ioClient.on('message', (message: Message) => {
            messages.push(message)
        })

        setTimeout(() => {
            const playbackMessage = messages.find((m) => m.type === 'playback')
            const volumeMessage = messages.find((m) => m.type === 'volume')

            assert.ok(
                playbackMessage &&
                    playbackMessage.type === 'playback' &&
                    playbackMessage.data.state === mockTrack1.state &&
                    playbackMessage.data.track === mockTrack1.track
            )
            assert.ok(
                volumeMessage &&
                    volumeMessage.type === 'volume' &&
                    volumeMessage.data.type === 'audible'
            )

            ioClient.disconnect()
            done()
        }, 100)

        ioClient.connect()
    })

    // TODO improve test
    it('should send foobar2000 playback info when a playback action is triggered', (done) => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const messages: PlaybackMessage[] = []

        ioClient.on('message', (message: Message) => {
            if (message.type === 'playback') {
                messages.push(message)
            }
        })

        ioClient.connect()
        ioClient.emit('foobarCommand', 'stop')

        setTimeout(() => {
            const playbackMessage = messages[1]

            assert.ok(messages.length === 2)
            assert.ok(playbackMessage.data.status === 112)

            ioClient.disconnect()
            done()
        }, 100)
    })

    // TODO improve test
    it('should send foobar2000 status info when volume is changed', (done) => {
        const ioClient = SocketIOClient(
            `http://127.0.0.1:${testServerPort}/`,
            ioOptions
        )

        const messages: VolumeMessage[] = []

        ioClient.on('message', (message: Message) => {
            if (message.type === 'volume') {
                messages.push(message)
            }
        })

        ioClient.connect()
        ioClient.emit('foobarCommand', 'vol mute')

        setTimeout(() => {
            const volumeMessage = messages[1]

            assert.ok(messages.length === 2)
            assert.ok(volumeMessage.data.type === 'muted')

            ioClient.disconnect()
            done()
        }, 100)
    })
})
