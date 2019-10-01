import { h, Component } from 'preact'

import { TrackInfo, Action } from '../server/Models'

interface Props {
    currentTrack: TrackInfo
    onFoobarCommand: (action: Action) => Action
}

export default class Playback extends Component<Props, {}> {
    render() {
        const { currentTrack, onFoobarCommand } = this.props

        return (
            <div className="playback">
                <div className="playback__controls">
                    <button
                        onClick={() =>
                            onFoobarCommand(
                                currentTrack.state === 'playing'
                                    ? 'pause'
                                    : 'play'
                            )
                        }
                    >
                        Play/Pause
                    </button>
                    <button onClick={() => onFoobarCommand('stop')}>
                        Stop
                    </button>
                    <button onClick={() => onFoobarCommand('prev')}>
                        Prev
                    </button>
                    <button onClick={() => onFoobarCommand('next')}>
                        Next
                    </button>
                </div>
                <div className="playback__current-track">
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
