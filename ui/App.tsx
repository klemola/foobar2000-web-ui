import { h, Component } from 'preact'

import { InfoMessage } from '../server/Models'
import { appMachine, appService, AppState } from './state'

const message: InfoMessage = {
    type: 'info',
    data: 'test'
}

export default class App extends Component<{}, AppState> {
    state = appMachine.initialState
    service = appService.onTransition(current => this.setState(current))

    componentDidMount() {
        this.service.start()
    }

    componentWillUnmount() {
        this.service.stop()
    }

    render() {
        return this.state.matches('initializing') ? (
            <div>
                <p>Loading...</p>
                <button onClick={() => this.service.send('READY')}>
                    Ready
                </button>
            </div>
        ) : (
            <div>{JSON.stringify(message, null, 2)}</div>
        )
    }
}
