/* eslint-disable import/no-extraneous-dependencies */
/* eslint no-console: off */

const Net = require('net')
const assert = require('assert')
const _ = require('lodash/fp')
const { mockTrack1, mockTrack2 } = require('./fixtures')

const initialMsg = `
999|Connected to foobar2000 Control Server v1.0.1|\r\n
999|Accepted client from 127.0.0.1|\r\n
999|There are currently 1/10 clients connected|\r\n
999|Type '?' or 'help' for command information|\r\n
`
const mockTrackInfoResponse = trackInfo =>
    `111|3|282|${trackInfo.secondsPlayed}|FLAC|605|${trackInfo.artist}|${
        trackInfo.album
    }|2013|Post-rock|?|${trackInfo.track}|${trackInfo.trackLength}|`
const mockVolResponse = '222|0.0|'

function onConnection(socket) {
    let currentTrack = _.clone(mockTrack1)

    socket.write(initialMsg)

    let interval = setInterval(() => {
        const nextSecondsPlayed = Number(currentTrack.secondsPlayed) + 1

        if (Number(currentTrack.trackLength) <= nextSecondsPlayed) {
            currentTrack = _.clone(
                currentTrack.trackNumber == '01' ? mockTrack2 : mockTrack1
            )
        } else {
            currentTrack.secondsPlayed = nextSecondsPlayed
        }
        socket.write(mockTrackInfoResponse(currentTrack))
    }, 1000)

    socket.on('data', data => {
        const stringData = data.toString()

        if (_.startsWith('trackinfo', stringData)) {
            return socket.write(mockTrackInfoResponse(currentTrack))
        }

        if (_.startsWith('vol', stringData)) {
            return socket.write(mockVolResponse)
        }

        return false
    })

    socket.on('close', () => clearInterval(interval))
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
