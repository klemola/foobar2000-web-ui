import * as net from 'net'
import { Vector } from 'prelude-ts'

import {
    mockTrack1,
    mockTrack2,
    initialMsg,
    mockTrackInfoResponse,
    mockVolumeResponse
} from './fixtures'
import { TrackInfo, Action, VolumeAction, Volume } from '../Models'
import * as Logger from '../Logger'

const updateVolume = (action: VolumeAction, currentVolume: Volume): Volume => {
    const volumeLevel =
        currentVolume.type === 'muted'
            ? currentVolume.previousVolume
            : currentVolume.volume

    switch (action) {
        case 'vol mute':
            return currentVolume.type === 'muted'
                ? {
                      type: 'audible',
                      volume: volumeLevel
                  }
                : {
                      type: 'muted',
                      previousVolume: volumeLevel
                  }
        case 'vol up':
            return {
                type: 'audible',
                volume: volumeLevel < 0 ? volumeLevel + 1 : 0
            }
        case 'vol down':
            return {
                type: 'audible',
                volume: volumeLevel - 1
            }
    }
}

const onConnection = (logger: Logger.Logger) => (socket: net.Socket) => {
    let currentTrack: TrackInfo = { ...mockTrack1 }
    let currentVolume: Volume = {
        type: 'audible',
        volume: 0.0
    }

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
                    currentVolume = updateVolume(stringData, currentVolume)
                    return socket.write(mockVolumeResponse(currentVolume))
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
