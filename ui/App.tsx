import { h, Component } from 'preact'
import io from 'socket.io-client'
import { Option } from 'prelude-ts'

import { Message, TrackInfo, Volume, Action } from '../server/Models'
import Playback from './Playback'
import VolumeControl from './VolumeControl'

// TODO: refactor into an union type
interface AppState {
    connected: boolean
    currentTrack: Option<TrackInfo>
    volume: Volume
}

const initialState: AppState = {
    connected: false,
    currentTrack: Option.none<TrackInfo>(),
    volume: {
        type: 'audible',
        volume: 0
    }
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
                case 'volume':
                    return this.setState({
                        volume: message.data
                    })
            }
        })
        this.socket.on('connect', () => this.setState({ connected: true }))
        this.socket.on('disconnect', () => this.setState({ connected: false }))
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
                {!this.state.connected || this.state.currentTrack.isNone() ? (
                    <div className="app__init">
                        <h1>Foobar2000 Web UI</h1>
                        <p>Connecting</p>
                    </div>
                ) : (
                    <div className="app__main">
                        <Playback
                            currentTrack={this.state.currentTrack.get()}
                            onFoobarCommand={this.onFoobarCommand}
                        />
                        <VolumeControl
                            currentVolume={this.state.volume}
                            onFoobarCommand={this.onFoobarCommand}
                        />
                    </div>
                )}
            </div>
        )
    }
}
