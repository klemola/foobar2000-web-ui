import { h, Component } from 'preact'

import { Volume, Action } from '../server/Models'

interface Props {
    currentVolume: Volume
    onFoobarCommand: (action: Action) => Action
}

export default class VolumeControl extends Component<Props, {}> {
    render() {
        const { currentVolume, onFoobarCommand } = this.props

        return (
            <div className="volume-control">
                <div className="volume-control__current-volume">
                    {currentVolume.type === 'audible'
                        ? currentVolume.volume
                        : 'Muted.'}
                </div>
                <div className="volume-control__controls">
                    <button onClick={() => onFoobarCommand('vol mute')}>
                        Mute/unmute
                    </button>
                    <button onClick={() => onFoobarCommand('vol down')}>
                        Vol-
                    </button>
                    <button onClick={() => onFoobarCommand('vol up')}>
                        Vol+
                    </button>
                </div>
            </div>
        )
    }
}
