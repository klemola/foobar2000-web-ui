import { h, FunctionalComponent } from 'preact'

import { Volume, Action } from '../server/Models'
import { formatVolume } from './format'
import * as Icon from './Icon'

interface Props {
    currentVolume: Volume
    onFoobarCommand: (action: Action) => Action
}

const VolumeControl: FunctionalComponent<Props> = (props: Props) => {
    const { currentVolume, onFoobarCommand } = props
    const volumePresentation = `Volume: ${formatVolume(currentVolume)}`

    return (
        <div className="volume">
            <div className="volume__value">{volumePresentation}</div>
            <div className="volume__controls">
                <button
                    className={
                        currentVolume.type === 'audible'
                            ? 'control-button'
                            : 'control-button--activated'
                    }
                    onClick={() => onFoobarCommand('vol mute')}
                >
                    <Icon.VolumeMute />
                </button>
                <button
                    className="control-button"
                    onClick={() => onFoobarCommand('vol down')}
                >
                    <Icon.VolumeDown />
                </button>
                <button
                    className="control-button"
                    onClick={() => onFoobarCommand('vol up')}
                >
                    <Icon.VolumeUp />
                </button>
            </div>
        </div>
    )
}

export default VolumeControl
