import { h, Component } from 'preact'

import * as Logger from './Logger'
import * as SideEffects from './SideEffects'
import {
    appMachine,
    appService,
    AppState,
    AppService,
    updateFromMessage
} from './state'

const configureEvents = (
    socket: SocketIOClient.Socket,
    service: AppService
) => {
    socket.on('connect', () => service.send({ type: 'READY' }))
    socket.on('reconnect', () => service.send({ type: 'READY' }))
    socket.on('disconnect', () => service.send({ type: 'DISCONNECTED' }))
    socket.on('message', updateFromMessage(service))

    return service
}

const logger = Logger.create()

export default class App extends Component<{}, AppState> {
    state = appMachine.initialState
    service = appService.onTransition(current => {
        logger.debug('Transition', current.value)
        this.setState(current)
    })
    socket = SideEffects.socket()

    componentDidMount() {
        this.service = configureEvents(this.socket, this.service)
        this.service.start()
    }

    componentWillUnmount() {
        this.socket.disconnect()
        this.service.stop()
    }

    render() {
        return this.state.matches('connecting') ? (
            <div>
                <p>Connecting</p>
            </div>
        ) : (
            <div>Ready</div>
        )
    }
}
