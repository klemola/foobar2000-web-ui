import {
    Number,
    String,
    Boolean,
    Literal,
    Record,
    Union,
    Unknown,
    Runtype,
    Static
} from 'runtypes'
import { Socket } from 'net'

import { Logger } from 'Logger'

export const Env = Union(
    Literal('production'),
    Literal('development'),
    Literal('test')
)

export type Env = Static<typeof Env>

export const PlaybackAction = Union(
    Literal('playpause'),
    Literal('stop'),
    Literal('prev'),
    Literal('next'),
    Literal('rand')
)

export type PlaybackAction = Static<typeof PlaybackAction>
export const playbackActions: readonly PlaybackAction[] = [
    'playpause',
    'stop',
    'prev',
    'next',
    'rand'
]

export const VolumeAction = Union(
    Literal('mute'),
    Literal('voldown'),
    Literal('volup')
)

export type VolumeAction = Static<typeof VolumeAction>
export const volumeActions: readonly VolumeAction[] = [
    'mute',
    'voldown',
    'volup'
]

export const Config = Record({
    appTitle: String,
    localIPGuess: String,
    guessIP: Boolean,
    foobarPath: String,
    controlServerPort: Number,
    webServerPort: Number,
    serverExternalIP: String,
    controlServerMessageSeparator: String,
    environment: Env
})

export type Config = Static<typeof Config>

const Context = Record({
    config: Config,
    logger: Unknown as Runtype<Logger>,
    client: Unknown as Runtype<Socket>
})

export type Context = Static<typeof Context>

export const TrackInfo = Record({
    status: Number,
    secondsPlayed: Number,
    codec: String,
    bitrate: Number,
    artist: String,
    album: String,
    date: String,
    genre: String,
    trackNumber: String,
    track: String,
    trackLength: Number,
    state: String
})

export type TrackInfo = Static<typeof TrackInfo>

export const VolumeInfo = Record({
    volume: String
})

export type VolumeInfo = Static<typeof VolumeInfo>

export const InfoMessage = Record({
    type: Literal('info'),
    data: String
})

export type InfoMessage = Static<typeof InfoMessage>

export const PlaybackMessage = Record({
    type: Literal('playback'),
    data: TrackInfo
})

export type PlaybackMessage = Static<typeof PlaybackMessage>

export const VolumeMessage = Record({
    type: Literal('volume'),
    data: VolumeInfo
})

export type VolumeMessage = Static<typeof VolumeMessage>

export const Message = Union(InfoMessage, PlaybackMessage, VolumeMessage)

export type Message = Static<typeof Message>
