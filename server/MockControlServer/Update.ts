import { Socket } from 'net'

import { mockTrack1, mockTrack2 } from '../test/fixtures'
import {
    TrackInfo,
    VolumeAction,
    Volume,
    PlaybackAction,
    Action,
} from '../Models'

export interface State {
    currentTrack: TrackInfo
    currentVolume: Volume
    previousVolume: Volume
    sockets: Array<Socket>
}

const MAX_VOLUME = 0
const MUTED_VOLUME = -100
const initialVolume: Volume = {
    type: 'audible',
    volume: 0.0,
}

const updatePlayback = (
    currentTrack: TrackInfo,
    action: PlaybackAction
): TrackInfo => {
    switch (action) {
        case 'play':
            return {
                ...currentTrack,
                state: 'playing',
                status: 111,
            }
        case 'pause':
            return {
                ...currentTrack,
                state: 'paused',
                status: 113,
            }
        case 'stop':
            return {
                ...currentTrack,
                secondsPlayed: 0,
                state: 'stopped',
                status: 112,
            }
        case 'prev':
        case 'next':
        case 'rand':
            return currentTrack.track === mockTrack1.track
                ? mockTrack2
                : mockTrack1
    }
}

const updateVolume = (
    currentVolume: Volume,
    previousVolume: Volume,
    action: VolumeAction
): Volume => {
    const previousVolumeLevel =
        previousVolume.type === 'audible' ? previousVolume.volume : MUTED_VOLUME
    const volumeLevel =
        currentVolume.type === 'muted'
            ? previousVolumeLevel
            : currentVolume.volume

    switch (action) {
        case 'vol mute':
            return currentVolume.type === 'audible'
                ? {
                      type: 'muted',
                  }
                : {
                      type: 'audible',
                      volume: volumeLevel,
                  }
        case 'vol up':
            return {
                type: 'audible',
                volume: volumeLevel < MAX_VOLUME ? volumeLevel + 1 : MAX_VOLUME,
            }
        case 'vol down':
            return {
                type: 'audible',
                volume:
                    volumeLevel > MUTED_VOLUME ? volumeLevel - 1 : MUTED_VOLUME,
            }
    }
}

export const init = (): State => ({
    currentTrack: { ...mockTrack1 },
    currentVolume: initialVolume,
    previousVolume: initialVolume,
    sockets: [],
})

export const update = (state: State, action: Action): State => {
    switch (action) {
        case 'trackinfo':
            return state
        case 'play':
        case 'pause':
        case 'stop':
        case 'prev':
        case 'next':
        case 'rand':
            return {
                ...state,
                currentTrack: updatePlayback(state.currentTrack, action),
            }
        case 'vol mute':
        case 'vol up':
        case 'vol down':
            return {
                ...state,
                currentVolume: updateVolume(
                    state.currentVolume,
                    state.previousVolume,
                    action
                ),
                previousVolume: state.currentVolume,
            }
    }
}
