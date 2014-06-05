'use strict';

var config = require('../config.js');
var VOLUME_CODE = 222;
var INFO_CODE = 999;
var statusCodes = {
    'playing': 111,
    'stopped': 112,
    'paused': 113
};

function getStatusNameByCode(code) {
    for (var status in statusCodes) {
        if (statusCodes[status] === code) {
            return status;
        }
    }
}

function parseTrackData(text) {
    var attributes = text.split('|');
    var statusFields = config.controlServerStatusFields;
    var trackData = {};

    attributes.forEach(function(item, iter) {
        var attribute = statusFields[iter];
        if (attribute) {
            trackData[attribute] = item;
        }
    });

    return trackData;
}

exports.parseControlData = function(text) {
    var lines;
    var parsedData = {};

    lines = text.split('\r\n');
    lines.forEach(function(item) {
        var messageCode = parseInt(item.substring(0, 3), 10);
        var status = getStatusNameByCode(messageCode);
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
