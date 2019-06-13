import {
    Message,
    VolumeMessage,
    TrackInfo,
    PlaybackMessage,
    InfoMessage
} from './Models'
import { Vector, Option, HashMap } from 'prelude-ts'

const statusCodes = {
    playing: 111,
    stopped: 112,
    paused: 113,
    volumeChange: 222,
    info: 999
}

const statusCodesHM = HashMap.ofObjectDictionary(statusCodes)

const statusFields = [
    'status',
    null,
    null,
    'secondsPlayed',
    'codec',
    'bitrate',
    'artist',
    'album',
    'date',
    'genre',
    'trackNumber',
    'track',
    'trackLength'
]

function parseTrackData(text: string): TrackInfo {
    const attributes = text.split('|')
    const trackData: any = {}

    attributes.forEach((item: string, iter: number) => {
        const attribute: string | null = statusFields[iter]
        if (attribute) {
            trackData[attribute] = [
                'status',
                'secondsPlayed',
                'bitrate',
                'trackLength'
            ].includes(attribute)
                ? Number(item)
                : item
        }
    })

    return trackData
}

function parseMessage(raw: string): Option<Message> {
    const messageCode = parseInt(raw.substring(0, 3), 10)

    switch (messageCode) {
        case statusCodes.info:
            return Option.of({
                type: 'info',
                data: raw
            })

        case statusCodes.volumeChange:
            const vol = Vector.ofIterable(raw.split('|'))
                .filter(v => v !== '')
                .last()

            return vol.map<VolumeMessage>(v => ({
                type: 'volume',
                data: {
                    volume: v
                }
            }))

        default:
            const trackInfo = parseTrackData(raw)
            const lookupResult = statusCodesHM.findAny(
                (k, v) => v === messageCode
            )

            return lookupResult.map<PlaybackMessage>(([status, code]) => ({
                type: 'playback',
                data: {
                    ...trackInfo,
                    state: status
                }
            }))
    }
}

export function parseControlData(text: string): Message[] {
    const lines: string[] = text.split('\r\n')
    const messageList = Vector.ofIterable(lines).mapOption<Message>(
        parseMessage
    )

    if (messageList.allMatch(InfoMessage.guard)) {
        return [
            {
                type: 'info',
                data: messageList.foldLeft(
                    '',
                    (data, message) =>
                        `${data}${data.length === 0 ? '' : '\n'}${message.data}`
                )
            }
        ]
    }

    return messageList.toArray()
}
