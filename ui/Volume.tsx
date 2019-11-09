import { h, FunctionalComponent } from 'preact'
import classnames from 'classnames'

import { Volume, Action } from '../server/Models'
import { formatVolume } from './format'
import * as Icon from './Icon'

interface Props {
    currentVolume: Volume
    onFoobarCommand: (action: Action) => Action
}

const VolumeControl: FunctionalComponent<Props> = (props: Props) => {
    const { currentVolume, onFoobarCommand } = props
    const volumePresentation = formatVolume(currentVolume)
    const atMaxVolume =
        currentVolume.type === 'audible' && currentVolume.volume === 0

    return (
        <div className="volume">
            <div className="volume__value">{volumePresentation}</div>
            <div className="volume__controls">
                <button
                    className={classnames({
                        'control-button': currentVolume.type === 'audible',
                        'control-button--activated':
                            currentVolume.type === 'muted'
                    })}
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
                    disabled={atMaxVolume}
                    onClick={() => onFoobarCommand('vol up')}
                >
                    <Icon.VolumeUp />
                </button>
            </div>
        </div>
    )
}

export default VolumeControl
