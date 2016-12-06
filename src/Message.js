const _ = require('lodash/fp');

const statusCodes = {
    playing: 111,
    stopped: 112,
    paused: 113,
    volumeChange: 222,
    info: 999,
};

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
    'trackLength',
];

function parseTrackData(text) {
    const attributes = text.split('|');
    const trackData = {};

    attributes.forEach(function(item, iter) {
        const attribute = statusFields[iter];
        if (attribute) {
            trackData[attribute] = item;
        }
    });

    return trackData;
}

function parseMetaData(line) {
    const messageCode = parseInt(line.substring(0, 3), 10);

    return {
        code: messageCode,
        raw: line,
    }
}

function parseMessage(data) {
    const code = _.head(data).code;
    const lastItem = _.last(data);

    switch (code) {
        case statusCodes.info:
            return {
                type: 'info',
                content: _(data)
                    .map('raw')
                    .join('\n'),
            };

        case statusCodes.volumeChange: 
            return {
                type: 'statusChange',
                status: {
                    volume:  lastItem.raw.split('|')[1],
                }
            }

        default:
            return {
                type: 'statusChange',
                status: _.merge(
                    { state: _.findKey(v => v === code, statusCodes) },
                    parseTrackData(lastItem.raw)
                ),
            };
    }
}

function parseControlData(text) {
    const lines = text.split('\r\n');

    return _(lines)
        .reject(l => l === '')
        .map(parseMetaData)
        .groupBy(lineMeta => lineMeta.code)
        .map(parseMessage)
        .value();
};

exports.parseControlData = parseControlData;
