import { h, FunctionalComponent } from 'preact'
import classnames from 'classnames'

import { TrackInfo, Action } from '../server/Models'
import TrackDetails from './TrackDetails'
import * as Icon from './Icon'

interface Props {
    currentTrack: TrackInfo
    onFoobarCommand: (action: Action) => Action
}

const Playback: FunctionalComponent<Props> = (props: Props) => {
    const { currentTrack, onFoobarCommand } = props
    const isPlaying = currentTrack.state === 'playing'
    const isStopped = currentTrack.state === 'stopped'
    const playPauseAction = currentTrack.state === 'playing' ? 'pause' : 'play'

    return (
        <div className="playback">
            <TrackDetails
                className="playback__current-track"
                trackInfo={currentTrack}
            />
            <div className="playback__controls--main">
                <button
                    class="control-button"
                    onClick={() => onFoobarCommand('prev')}
                >
                    <Icon.Backward />
                </button>
                <button
                    class="control-button--large"
                    onClick={() => onFoobarCommand(playPauseAction)}
                >
                    {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                </button>
                <button
                    class="control-button"
                    onClick={() => onFoobarCommand('next')}
                >
                    <Icon.Forward />
                </button>
            </div>
            <div className="playback__controls--secondary">
                <button
                    className={classnames({
                        'control-button--small': !isStopped,
                        'control-button--small--activated': isStopped
                    })}
                    onClick={() => onFoobarCommand(isStopped ? 'play' : 'stop')}
                >
                    <Icon.Stop />
                </button>
                <div className="playback__controls--secondary__spacer" />
                <button
                    class="control-button--small"
                    onClick={() => onFoobarCommand('rand')}
                >
                    <Icon.Random />
                </button>
            </div>
        </div>
    )
}

export default Playback
