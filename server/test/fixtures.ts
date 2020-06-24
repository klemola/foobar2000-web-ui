import { TrackInfo } from '../Models'

export const mockTrack1: TrackInfo = {
    status: 111,
    secondsPlayed: 1,
    codec: 'FLAC',
    bitrate: 605,
    artist: 'Mock Artist',
    album: 'Mock Album',
    date: '2019',
    genre: 'Test',
    trackNumber: '01',
    track: 'Mock Track #1',
    trackLength: 120,
    state: 'playing',
}

export const mockTrack2: TrackInfo = {
    status: 111,
    secondsPlayed: 1,
    codec: 'FLAC',
    bitrate: 605,
    artist: 'Mock Artist',
    album: 'Mock Album',
    date: '2019',
    genre: 'Test',
    trackNumber: '02',
    track: 'Mock Track #2',
    trackLength: 30,
    state: 'playing',
}

export const initialMsg = `999|Connected to foobar2000 Control Server v1.0.1|\r
999|Accepted client from 127.0.0.1|\r
999|There are currently 1/10 clients connected|\r
999|Type '?' or 'help' for command information|\r`
