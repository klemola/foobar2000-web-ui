import * as net from 'net'
import { Vector } from 'prelude-ts'

import * as Logger from '../Logger'
import { init, update, State } from './Update'
import { initialMsg } from '../test/fixtures'
import { TrackInfo, Volume, Action } from '../Models'

class StateWrapper {
    state: State = init()
    sockets: Array<net.Socket> = []

    get(): State {
        return this.state
    }

    set(next: State): State {
        this.state = next
        return this.state
    }

    addSocket(socket: net.Socket): Array<net.Socket> {
        this.sockets = this.sockets.concat([socket])
        return this.listSockets()
    }

    listSockets(): Array<net.Socket> {
        return this.sockets
    }
}

const mockTrackInfoResponse = (t: TrackInfo): string =>
    [
        t.status,
        '3',
        '282',
        t.secondsPlayed,
        t.codec,
        t.bitrate,
        t.artist,
        t.album,
        t.date,
        t.genre,
        t.trackNumber,
        t.track,
        t.trackLength,
    ].join('|')

const mockVolumeResponse = Volume.match(
    (muted) => `222|-100.00|`,
    (audible) => `222|${audible.volume.toFixed(2)}|`
)

const onConnection = (stateWrapper: StateWrapper, logger: Logger.Logger) => (
    socket: net.Socket
): void => {
    socket.write(
        [
            initialMsg,
            mockTrackInfoResponse(stateWrapper.get().currentTrack),
        ].join('\r\n')
    )

    // TODO: Remove socket when connection is closed
    stateWrapper.addSocket(socket)

    socket.on('data', (data) => {
        const state = stateWrapper.get()
        const stringData = Vector.ofIterable(data.toString())
            // get rid of CRLF
            .dropRight(2)
            .mkString('')

        if (Action.guard(stringData)) {
            const nextState = stateWrapper.set(update(state, stringData))

            socket.write(
                [
                    mockTrackInfoResponse(nextState.currentTrack),
                    mockVolumeResponse(nextState.currentVolume),
                ].join('\r\n')
            )

            return logger.debug('Received command', {
                action: stringData,
                state: nextState,
            })
        } else {
            return logger.warn('Unknown command', {
                action: stringData,
            })
        }
    })
}

export const createServer = (host: string, port: number): net.Server => {
    const stateWrapper = new StateWrapper()
    const logger = Logger.create('test', 'mock-control-server')
    const server = net.createServer(onConnection(stateWrapper, logger))

    const tick = setInterval(() => {
        const state = stateWrapper.get()
        const nextSecondsPlayed =
            state.currentTrack.state === 'playing'
                ? state.currentTrack.secondsPlayed + 1
                : state.currentTrack.secondsPlayed

        const trackEnded = state.currentTrack.trackLength <= nextSecondsPlayed

        stateWrapper.set(
            trackEnded
                ? update(state, 'next')
                : {
                      ...state,
                      currentTrack: {
                          ...state.currentTrack,
                          secondsPlayed: nextSecondsPlayed,
                      },
                  }
        )

        if (trackEnded) {
            stateWrapper
                .listSockets()
                .forEach((socket) =>
                    socket.write(
                        mockTrackInfoResponse(stateWrapper.get().currentTrack)
                    )
                )
        }
    }, 1000)

    server.on('close', () => clearInterval(tick))
    server.listen(port, host)

    return server
}
