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
    content: string
}

export interface PlaybackMessage {
    type: 'statusChange'
    status: TrackInfo
}

export interface VolumeMessage {
    type: 'statusChange'
    status: VolumeInfo
}

export type Message = InfoMessage | PlaybackMessage | VolumeMessage

export const isInfoMessage = (message: Message): message is InfoMessage =>
    message.type === 'info'

export const isPlaybackMessage = (
    message: Message
): message is PlaybackMessage => message.type === 'statusChange'
