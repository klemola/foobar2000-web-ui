/* eslint-disable import/no-extraneous-dependencies */
/* eslint no-console: off */

const Net = require('net')
const assert = require('assert')
const _ = require('lodash/fp')

const initialMsg = [
    '999|Connected to foobar2000 Control Server v1.0.1|\r\n',
    '999|Accepted client from 127.0.0.1|\r\n',
    '999|There are currently 1/10 clients connected|\r\n',
    "999|Type '?' or 'help' for command information|\r\n"
].join('')
const mockTrackInfoResponse =
    '113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|?|Bronchitis (entire)|745|'
const mockVolResponse = '222|0.0|'

function onConnection(socket) {
    socket.write(initialMsg)

    socket.on('data', data => {
        const stringData = data.toString()

        if (_.startsWith('trackinfo', stringData)) {
            return socket.write(mockTrackInfoResponse)
        }

        if (_.startsWith('vol', stringData)) {
            return socket.write(mockVolResponse)
        }

        return false
    })
}

function createServer(host, port) {
    const server = Net.createServer(onConnection)

    server.listen(port, host)

    return server
}

// test the server
if (require.main === module) {
    const host = '127.0.0.1'
    const port = 9999
    const server = createServer(host, port)
    const client = new Net.Socket()
    const receivedData = []

    console.log('Testing mock server 🎵')

    client.connect(port, host, () => {
        setTimeout(() => client.write('trackinfo'), 50)
        setTimeout(() => client.write('vol mute'), 100)
    })

    client.on('data', data => {
        receivedData.push(data.toString())
    })
    client.on('end', () => console.log('Connection closed'))
    client.on('error', err => console.error(err))

    setTimeout(() => {
        assert(receivedData[0] === initialMsg)
        assert(receivedData[1] === mockTrackInfoResponse)
        assert(receivedData[2] === mockVolResponse)

        console.log('Mock server works 👍')

        client.destroy()
        server.close()
        process.exit(0)
    }, 300)
}

exports.createServer = createServer
