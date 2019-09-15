/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { assert } from 'chai'

import * as Message from '../Message'
import {
    TrackInfo,
    InfoMessage,
    PlaybackMessage,
    VolumeMessage,
    Volume
} from '../Models'

describe('Message', () => {
    it('should parse an information block', () => {
        const lines = [
            '999|Connected to foobar2000 Control Server v1.0.1|',
            '999|Accepted client from 127.0.0.1|',
            '999|There are currently 2/10 clients connected|',
            "999|Type '?' or 'help' for command information|"
        ]
        const message = lines.join('\r\n')
        const expectedMessage = lines.join('\n')
        const messages = Message.parseControlData(message)
        const infoMessage = InfoMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.equal(infoMessage.data, expectedMessage)
    })

    it('should parse a playback status message', () => {
        const message =
            '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|'
        const expectedTrackData: TrackInfo = {
            status: 111,
            secondsPlayed: 2.73,
            codec: 'FLAC',
            bitrate: 605,
            artist: 'Imaginary Friends',
            album: 'Bronchitis',
            date: '2013',
            genre: 'Post-rock',
            trackNumber: '01',
            track: 'Bronchitis (entire)',
            trackLength: 745,
            state: 'playing'
        }
        const messages = Message.parseControlData(message)
        const playbackMessage = PlaybackMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.deepEqual(playbackMessage.data, expectedTrackData)
    })

    it('should set state "playing" for code "111"', () => {
        const message =
            '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|'
        const messages = Message.parseControlData(message)
        const playbackMessage = PlaybackMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.equal(playbackMessage.data.state, 'playing')
    })

    it('should set state "stopped" for code "112"', () => {
        const message =
            '112|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|'
        const messages = Message.parseControlData(message)
        const playbackMessage = PlaybackMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.equal(playbackMessage.data.state, 'stopped')
    })

    it('should set state "paused" for code "113"', () => {
        const message =
            '113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|'
        const messages = Message.parseControlData(message)
        const playbackMessage = PlaybackMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.equal(playbackMessage.data.state, 'paused')
    })

    it('should parse a volume message', () => {
        const message = '222|-1.58|'
        const mockStatus: Volume = {
            type: 'audible',
            volume: -1.58
        }

        const messages = Message.parseControlData(message)
        const volumeMessage = VolumeMessage.check(messages[0])

        assert.equal(messages.length, 1)
        assert.deepEqual(volumeMessage.data, mockStatus)
    })
})
