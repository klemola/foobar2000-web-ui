import { h, FunctionalComponent } from 'preact'

import { Volume, Action } from '../server/Models'

interface Props {
    currentVolume: Volume
    onFoobarCommand: (action: Action) => Action
}

const VolumeControl: FunctionalComponent<Props> = (props: Props) => {
    const { currentVolume, onFoobarCommand } = props
    const volumePresentation = `Volume: ${
        currentVolume.type === 'audible' ? currentVolume.volume : 'Muted.'
    } dB`

    return (
        <div className="volume">
            <div className="volume__value">{volumePresentation}</div>
            <div className="volume__controls">
                <button
                    className="volume__controls__button"
                    onClick={() => onFoobarCommand('vol down')}
                >
                    Vol-
                </button>
                <button
                    className="volume__controls__button"
                    onClick={() => onFoobarCommand('vol up')}
                >
                    Vol+
                </button>
                <button
                    className="volume__controls__button"
                    onClick={() => onFoobarCommand('vol mute')}
                >
                    Mute/unmute
                </button>
            </div>
        </div>
    )
}

export default VolumeControl
