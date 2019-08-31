import io from 'socket.io-client'

export const socket = () => {
    const socket = io.connect('/')
    return socket
}

export const sendMessage = (socket: SocketIOClient.Socket, message: any) => {
    socket.send()
}
