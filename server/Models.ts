import {
    Number,
    String,
    Boolean,
    Literal,
    Record,
    Union,
    Unknown,
    Runtype,
    Static,
    Null
} from 'runtypes'
import { Socket } from 'net'

import { Logger } from 'Logger'
import { ChildProcessWithoutNullStreams } from 'child_process'

export const Env = Union(
    Literal('production'),
    Literal('development'),
    Literal('test')
)

export type Env = Static<typeof Env>

export const StatusType = Union(
    Literal('playing'),
    Literal('stopped'),
    Literal('paused'),
    Literal('volumeChange'),
    Literal('info'),
    Literal('unknown')
)

export type StatusType = Static<typeof StatusType>

export const PlaybackAction = Union(
    Literal('play'),
    Literal('pause'),
    Literal('stop'),
    Literal('prev'),
    Literal('next'),
    Literal('rand')
)

export type PlaybackAction = Static<typeof PlaybackAction>
export const playbackActions: readonly PlaybackAction[] = [
    'play',
    'pause',
    'stop',
    'prev',
    'next',
    'rand'
]

export const VolumeAction = Union(
    Literal('vol mute'),
    Literal('vol down'),
    Literal('vol up')
)

export type VolumeAction = Static<typeof VolumeAction>
export const volumeActions: readonly VolumeAction[] = [
    'vol mute',
    'vol down',
    'vol up'
]

export const MetaAction = Union(Literal('trackinfo'))
export type MetaAction = Static<typeof MetaAction>

export const Action = Union(PlaybackAction, VolumeAction, MetaAction)
export type Action = Static<typeof Action>

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

export const FB2KInstance = (Unknown as Runtype<
    ChildProcessWithoutNullStreams
>).Or(Null)

export type FB2KInstance = Static<typeof FB2KInstance>

const Context = Record({
    config: Config,
    logger: Unknown as Runtype<Logger>,
    client: Unknown as Runtype<Socket>,
    instance: FB2KInstance
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

export const Muted = Record({
    type: Literal('muted'),
    previousVolume: Number
})

export type Muted = Static<typeof Muted>

export const Audible = Record({
    type: Literal('audible'),
    volume: Number
})

export type Audible = Static<typeof Audible>

export const Volume = Union(Muted, Audible)

export type Volume = Static<typeof Volume>
