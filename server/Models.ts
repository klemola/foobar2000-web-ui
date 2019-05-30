import * as Bunyan from 'bunyan'
import * as Net from 'net'

export interface Context {
    config: any
    logger: Bunyan
    client: Net.Socket
}

export interface TrackInfo {
    status: number
    secondsPlayed: number
    codec: string
    bitrate: number
    artist: string
    album: string
    date: string
    genre: string
    trackNumber: string
    track: string
    trackLength: number
    state: string
}

export interface VolumeInfo {
    volume: 'string'
}

export interface InfoMessage {
    type: 'info'
    data: string
}

export interface PlaybackMessage {
    type: 'playback'
    data: TrackInfo
}

export interface VolumeMessage {
    type: 'volume'
    data: VolumeInfo
}

export type Message = InfoMessage | PlaybackMessage | VolumeMessage

export const isInfoMessage = (message: Message): message is InfoMessage =>
    message.type === 'info'

export const isPlaybackMessage = (
    message: Message
): message is PlaybackMessage => message.type === 'playback'

export const isVolumeMessage = (message: Message): message is VolumeMessage =>
    message.type === 'volume'
