const config = require('../config.js');

const VOLUME_CODE = 222;
const INFO_CODE = 999;
const statusCodes = {
    'playing': 111,
    'stopped': 112,
    'paused': 113
};

function getStatusNameByCode(code) {
    for (let status in statusCodes) {
        if (statusCodes[status] === code) {
            return status;
        }
    }
}

function parseTrackData(text) {
    const attributes = text.split('|');
    const statusFields = config.controlServerStatusFields;
    const trackData = {};

    attributes.forEach(function(item, iter) {
        const attribute = statusFields[iter];
        if (attribute) {
            trackData[attribute] = item;
        }
    });

    return trackData;
}

function parseControlData(text) {
    const lines = text.split('\r\n');
    const parsedData = {};

    lines.forEach(function(item) {
        const messageCode = parseInt(item.substring(0, 3), 10);
        const status = getStatusNameByCode(messageCode);
        if (status) {
            parsedData.status = parseTrackData(item);
            parsedData.status.state = status;
        } else if (messageCode === VOLUME_CODE) {
            parsedData.status = {
                volume: item.split('|')[1]
            };
        } else if (messageCode === INFO_CODE) {
            if (!parsedData.info) {
                parsedData.info = '';
            }
            parsedData.info += item + '\n';
        }
    });

    return parsedData;
};

exports.parseControlData = parseControlData;
