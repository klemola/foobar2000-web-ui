import { Message } from './Models'
const _: any = require('lodash/fp')

const statusCodes = {
    playing: 111,
    stopped: 112,
    paused: 113,
    volumeChange: 222,
    info: 999
}

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

function parseTrackData(text: string) {
    const attributes = text.split('|')
    const trackData: any = {}

    attributes.forEach((item: string, iter: number) => {
        const attribute: string | null = statusFields[iter]
        if (attribute) {
            trackData[attribute] = _.contains(attribute, [
                'status',
                'secondsPlayed',
                'bitrate',
                'trackLength'
            ])
                ? Number(item)
                : item
        }
    })

    return trackData
}

function parseMetaData(line: string) {
    const messageCode = parseInt(line.substring(0, 3), 10)

    return {
        code: messageCode,
        raw: line
    }
}

function parseMessage(data: any[]): Message {
    const code = _.head(data).code
    const lastItem = _.last(data)

    switch (code) {
        case statusCodes.info:
            return {
                type: 'info',
                data: _(data)
                    .map('raw')
                    .join('\n')
            }

        case statusCodes.volumeChange:
            return {
                type: 'volume',
                data: {
                    volume: lastItem.raw.split('|')[1]
                }
            }

        default:
            return {
                type: 'playback',
                data: _.merge(
                    { state: _.findKey((v: any) => v === code, statusCodes) },
                    parseTrackData(lastItem.raw)
                )
            }
    }
}

export function parseControlData(text: string): Message[] {
    const lines: string[] = text.split('\r\n')

    return _(lines)
        .reject((l: string) => l === '')
        .map(parseMetaData)
        .groupBy((lineMeta: any) => lineMeta.code)
        .map(parseMessage)
        .value()
}
