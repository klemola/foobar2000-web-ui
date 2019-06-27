import { mockTrack1, mockTrack2 } from '../test/fixtures'
import {
    TrackInfo,
    VolumeAction,
    Volume,
    PlaybackAction,
    Action
} from '../Models'

export interface State {
    currentTrack: TrackInfo
    currentVolume: Volume
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
                status: 111
            }
        case 'pause':
            return {
                ...currentTrack,
                state: 'paused',
                status: 113
            }
        case 'stop':
            return {
                ...currentTrack,
                secondsPlayed: 0,
                state: 'stopped',
                status: 112
            }
        case 'prev':
        case 'next':
        case 'rand':
            return currentTrack.track === mockTrack1.track
                ? mockTrack2
                : mockTrack1
    }
}

const updateVolume = (currentVolume: Volume, action: VolumeAction): Volume => {
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

export const init = (): State => ({
    currentTrack: { ...mockTrack1 },
    currentVolume: {
        type: 'audible',
        volume: 0.0
    }
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
                currentTrack: updatePlayback(state.currentTrack, action)
            }
        case 'vol mute':
        case 'vol up':
        case 'vol down':
            return {
                ...state,
                currentVolume: updateVolume(state.currentVolume, action)
            }
    }
}
