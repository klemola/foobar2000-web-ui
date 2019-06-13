import { Vector, HashMap, Option } from 'prelude-ts'

import { Message, TrackInfo, InfoMessage } from './Models'
import { Result, Failure } from 'runtypes'

type StatusName =
    | 'playing'
    | 'stopped'
    | 'paused'
    | 'volumeChange'
    | 'info'
    | 'unknown'

const statusCodes: HashMap<string, StatusName> = HashMap.of(
    ['111', 'playing'],
    ['112', 'stopped'],
    ['113', 'paused'],
    ['222', 'volumeChange'],
    ['999', 'info']
)

const trackInfoKeys: (keyof TrackInfo)[] = [
    'status',
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

const trackInfoKeysWithNumberValue: (keyof TrackInfo)[] = [
    'status',
    'secondsPlayed',
    'bitrate',
    'trackLength'
]

const parseMessageFailure: Failure = {
    success: false,
    message: 'Could not parse message'
}

function statusCodeToName(code: string): StatusName {
    const lookupResult = statusCodes.findAny((key, _) => code === key)

    if (lookupResult.isNone()) {
        return 'unknown'
    }

    return lookupResult.get()[1]
}

function parseTrackData(text: string): Result<TrackInfo> {
    const items = Vector.ofIterable(text.split('|'))
    const status = items.head()
    // Get rid of fields that we don't care about
    const otherValues = items.drop(3)

    if (status.isNone() || otherValues.length() < trackInfoKeys.length - 1) {
        return {
            success: false,
            message: 'Could not parse track data'
        }
    }

    const values = otherValues.prepend(status.get())
    const trackInfoEntries = Vector.zip(trackInfoKeys, values)
    const trackInfo = HashMap.ofIterable(trackInfoEntries)
        .filterKeys(k => !k.startsWith('unknown'))
        .map((k, v) => [k, mapTrackInfoValue(k, v)])
        .put('state', statusCodeToName(status.get()))
        .toObjectDictionary(x => x)

    return TrackInfo.validate(trackInfo)
}

function mapTrackInfoValue(k: keyof TrackInfo, v: string): string | number {
    return trackInfoKeysWithNumberValue.includes(k) ? Number(v) : v
}

function parseMessage(raw: string): Result<Message> {
    const messageCode = raw.substring(0, 3)

    switch (statusCodeToName(messageCode)) {
        case 'info':
            return {
                success: true,
                value: {
                    type: 'info',
                    data: raw
                }
            }

        case 'volumeChange':
            const vol = Vector.ofIterable(raw.split('|'))
                .filter(v => v !== '')
                .last()

            return vol.isSome()
                ? {
                      success: true,
                      value: {
                          type: 'volume',
                          data: {
                              volume: vol.get()
                          }
                      }
                  }
                : parseMessageFailure

        case 'playing':
        case 'paused':
        case 'stopped':
            const trackInfo = parseTrackData(raw)
            return trackInfo.success
                ? {
                      ...trackInfo,
                      value: {
                          type: 'playback',
                          data: trackInfo.value
                      }
                  }
                : trackInfo
        default:
            return parseMessageFailure
    }
}

export function parseControlData(text: string): Message[] {
    const lines: string[] = text.split('\r\n')
    const messageList: Vector<Message> = Vector.ofIterable(lines).mapOption(
        l => {
            const messageResult = parseMessage(l)
            return messageResult.success
                ? Option.of(messageResult.value)
                : Option.none()
        }
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
