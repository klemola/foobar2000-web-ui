var IPList = require('./src/localIPList').IPList;

//defines whether local IP is parsed from network interfaces or set manually
var guessIP = true;

module.exports = {

    //foobar2000.exe location in your filesystem. Slash after last folder name optional.
    FOOBAR_PATH: 'C:/Program Files (x86)/foobar2000',

    //If set to true, server start Foobar2000 if it's not started yet.
    startFoobar2000Automatically: true,

    //foo_controlserver port (default is '3333' in component configuration).
    CONTROL_SERVER_PORT: 3333,

    //Web UI port.
    WEB_SERVER_PORT: 3000,

    //Defines the IP that is used to access the UI from your network (ex. 192.168.0.1).
    //By default the IP is parsed from network interfaces (see above), but it can also be set up manually.
    SERVER_EXTERNAL_IP: (guessIP) ? IPList[0] : '127.0.0.1',

    //By default foo_controlserver uses '|' as a separator, change if needed.
    CONTROL_SERVER_MESSAGE_SEPARATOR: '|',

    //These actions correspond to buttons in UI. Defaults are what foobar supports and includes in it's native UI.
    playbackActions: [
        'playpause',
        'stop',
        'prev',
        'next',
        'rand'
    ],

    volumeActions: [
        'mute',
        'voldown',
        'volup'
    ],

    //These are human readable names for information that foo_controlserver sends with track data.
    //Order of this array is very important, do not change if you are using default foo_controlserver configuration.
    controlServerStatusFields: [
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

};
