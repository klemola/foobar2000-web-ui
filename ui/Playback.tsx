import { h, FunctionalComponent } from 'preact'

import { TrackInfo, Action } from '../server/Models'
import TrackDetails from './TrackDetails'

interface Props {
    currentTrack: TrackInfo
    onFoobarCommand: (action: Action) => Action
}

const Playback: FunctionalComponent<Props> = (props: Props) => {
    const { currentTrack, onFoobarCommand } = props
    const playPauseAction = currentTrack.state === 'playing' ? 'pause' : 'play'

    return (
        <div className="playback">
            <TrackDetails
                className="playback__current-track"
                trackInfo={currentTrack}
            />
            <div className="playback__controls--main">
                <button
                    class="playback__controls__button"
                    onClick={() => onFoobarCommand('prev')}
                >
                    Prev
                </button>
                <button
                    class="playback__controls__button"
                    onClick={() => onFoobarCommand(playPauseAction)}
                >
                    {playPauseAction}
                </button>
                <button
                    class="playback__controls__button"
                    onClick={() => onFoobarCommand('next')}
                >
                    Next
                </button>
            </div>
            <div className="playback__controls--secondary">
                <button
                    class="playback__controls__button"
                    onClick={() => onFoobarCommand('stop')}
                >
                    Stop
                </button>
                <button
                    class="playback__controls__button"
                    onClick={() => onFoobarCommand('rand')}
                >
                    Random
                </button>
            </div>
        </div>
    )
}

export default Playback
