import * as net from 'net'

import { mockTrack1, mockTrack2 } from './fixtures'
import { TrackInfo, Action } from '../Models'
import * as Logger from '../Logger'
import { Vector } from 'prelude-ts'

const initialMsg = `999|Connected to foobar2000 Control Server v1.0.1|\r
999|Accepted client from 127.0.0.1|\r
999|There are currently 1/10 clients connected|\r
999|Type '?' or 'help' for command information|\r`

const mockTrackInfoResponse = (trackInfo: TrackInfo) =>
    `${trackInfo.status}|3|282|${trackInfo.secondsPlayed}|FLAC|605|${
        trackInfo.artist
    }|${trackInfo.album}|2013|Post-rock|?|${trackInfo.track}|${
        trackInfo.trackLength
    }|`
const mockVolResponse = '222|0.0|'

const onConnection = (logger: Logger.Logger) => (socket: net.Socket) => {
    let currentTrack: TrackInfo = { ...mockTrack1 }

    socket.write(initialMsg)
    socket.write(mockTrackInfoResponse(currentTrack))

    let interval = setInterval(() => {
        const nextSecondsPlayed = Number(currentTrack.secondsPlayed) + 1

        if (Number(currentTrack.trackLength) <= nextSecondsPlayed) {
            currentTrack =
                currentTrack.trackNumber == '01'
                    ? { ...mockTrack2 }
                    : { ...mockTrack1 }
        } else {
            currentTrack.secondsPlayed = nextSecondsPlayed
        }
        socket.write(mockTrackInfoResponse(currentTrack))
    }, 1000)

    socket.on('data', data => {
        const stringData = Vector.ofIterable(data.toString())
            // get rid of CRLF
            .dropRight(2)
            .mkString('')

        if (Action.guard(stringData)) {
            logger.debug('Received command', {
                action: stringData
            })

            switch (stringData) {
                case 'trackinfo':
                    return socket.write(mockTrackInfoResponse(currentTrack))
                case 'vol mute':
                case 'vol up':
                case 'vol down':
                    return socket.write(mockVolResponse)
                default:
                    return false
            }
        } else {
            return logger.warn('Unknown command', {
                action: stringData
            })
        }
    })

    socket.on('close', () => clearInterval(interval))
}

export const createServer = (host: string, port: number): net.Server => {
    const logger = Logger.create('test', 'mock-control-server')
    const server = net.createServer(onConnection(logger))

    server.listen(port, host)

    return server
}
