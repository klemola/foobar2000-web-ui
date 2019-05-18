/* eslint-disable import/no-extraneous-dependencies */
const mockTrack1 = {
    status: '111',
    secondsPlayed: '1',
    codec: 'FLAC',
    bitrate: '605',
    artist: 'Mock Artist',
    album: 'Mock Album',
    date: '2019',
    genre: 'Test',
    trackNumber: '01',
    track: 'Mock Track #1',
    trackLength: '120',
    state: 'playing'
}

const mockTrack2 = {
    status: '111',
    secondsPlayed: '1',
    codec: 'FLAC',
    bitrate: '605',
    artist: 'Mock Artist',
    album: 'Mock Album',
    date: '2019',
    genre: 'Test',
    trackNumber: '02',
    track: 'Mock Track #2',
    trackLength: '30',
    state: 'playing'
}

module.exports = {
    mockTrack1,
    mockTrack2,
    mockTracks: [mockTrack1, mockTrack2]
}
