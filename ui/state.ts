import { Machine, MachineConfig, interpret, State } from 'xstate'
import { Message } from '../server/Models'

interface PlaybackStateSchema {
    states: {
        stopped: {}
        playing: {}
        paused: {}
    }
}

interface AppStateSchema {
    states: {
        connecting: {}
        ready: PlaybackStateSchema
    }
}

type PlaybackEvent = { type: 'PLAY' } | { type: 'PAUSE' } | { type: 'STOP' }
type AppEvent = { type: 'READY' } | { type: 'DISCONNECTED' } | PlaybackEvent

interface AppContext {}

const appMachineConfig: MachineConfig<AppContext, AppStateSchema, AppEvent> = {
    id: 'app',
    initial: 'connecting',
    states: {
        connecting: {
            on: {
                get READY() {
                    return appMachine.states.ready
                }
            }
        },
        ready: {
            id: 'playback',
            initial: 'stopped',
            on: {
                get DISCONNECTED() {
                    return appMachine.states.connecting
                }
            },
            states: {
                stopped: {
                    on: {
                        get PLAY() {
                            return appMachine.states.ready.states.playing
                        }
                    }
                },
                playing: {
                    on: {
                        get STOP() {
                            return appMachine.states.ready.states.stopped
                        },
                        get PAUSE() {
                            return appMachine.states.ready.states.paused
                        }
                    }
                },
                paused: {
                    on: {
                        get STOP() {
                            return appMachine.states.ready.states.stopped
                        },
                        get PLAY() {
                            return appMachine.states.ready.states.playing
                        }
                    }
                }
            }
        }
    }
}

export const appMachine = Machine<AppContext, AppStateSchema, AppEvent>(
    appMachineConfig
)

export const updateFromMessage = (service: AppService) => (
    message: Message
): AppService => {
    return service
}

export const appService = interpret(appMachine)
export type AppService = typeof appService
export type AppState = State<AppContext, AppEvent>
