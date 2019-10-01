import { h, Component } from 'preact'
import io from 'socket.io-client'
import { Option } from 'prelude-ts'

import { Message, TrackInfo, Volume, Action } from '../server/Models'
import Playback from './Playback'
import VolumeControl from './VolumeControl'

// TODO: refactor into an union type (and remove infoMessages)
interface AppState {
    currentTrack: Option<TrackInfo>
    volume: Volume
    infoMessages: Array<String>
}

const initialState: AppState = {
    currentTrack: Option.none<TrackInfo>(),

    volume: {
        type: 'audible',
        volume: 0
    },
    infoMessages: []
}

export default class App extends Component<{}, AppState> {
    socket = io('/', {
        autoConnect: false
    })
    state = initialState

    componentDidMount() {
        this.socket.on('message', (message: Message) => {
            switch (message.type) {
                case 'playback':
                    return this.setState({
                        currentTrack: Option.of(message.data)
                    })
                case 'info':
                    return this.setState({
                        infoMessages: this.state.infoMessages.concat([
                            message.data
                        ])
                    })
                case 'volume':
                    return this.setState({
                        volume: message.data
                    })
            }
        })
        this.socket.open()
    }

    componentWillUnmount() {
        this.socket.close()
    }

    onFoobarCommand = (action: Action): Action => {
        this.socket.emit('foobarCommand', action)
        return action
    }

    render() {
        return (
            <div className="app">
                {this.socket.disconnected ||
                this.state.currentTrack.isNone() ? (
                    <h1>Connecting</h1>
                ) : (
                    <div>
                        <VolumeControl
                            currentVolume={this.state.volume}
                            onFoobarCommand={this.onFoobarCommand}
                        />
                        <Playback
                            currentTrack={this.state.currentTrack.get()}
                            onFoobarCommand={this.onFoobarCommand}
                        />
                    </div>
                )}
            </div>
        )
    }
}
