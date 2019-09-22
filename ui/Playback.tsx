import { h, Component } from 'preact'

import { TrackInfo, PlaybackAction } from '../server/Models'

interface Props {
    currentTrack: TrackInfo
    onPlaybackChange: (action: PlaybackAction) => void
}

export default class Playback extends Component<Props, {}> {
    render() {
        const { currentTrack, onPlaybackChange } = this.props

        return (
            <div>
                <div>
                    <button
                        onClick={() =>
                            onPlaybackChange(
                                currentTrack.state === 'playing'
                                    ? 'pause'
                                    : 'play'
                            )
                        }
                    >
                        Play/Pause
                    </button>
                    <button onClick={() => onPlaybackChange('stop')}>
                        Stop
                    </button>
                    <button onClick={() => onPlaybackChange('prev')}>
                        Prev
                    </button>
                    <button onClick={() => onPlaybackChange('next')}>
                        Next
                    </button>
                </div>
                <div>
                    {currentTrack.state === 'stopped' ? (
                        <div>Stopped.</div>
                    ) : (
                        <ul>
                            <li>{currentTrack.artist}</li>
                            <li>{currentTrack.album}</li>
                            <li>{currentTrack.track}</li>
                            <li>{currentTrack.secondsPlayed}</li>
                        </ul>
                    )}
                </div>
            </div>
        )
    }
}
