module.exports = {

    //foobar2000.exe location in your filesystem. Slash after last folder name optional.
    FOOBAR_PATH: 'C:/Program Files (x86)/foobar2000',

    //foo_controlserver port (default is '3333' in component configuration).
    CONTROL_SERVER_PORT: 3333,

    //Web UI port.
    WEB_SERVER_PORT: 3000,

    //Change this IP tp DHCP or static IP if you want to be able to access the UI from your network (ex. 192.168.0.1).
    SERVER_EXTERNAL_IP: '127.0.0.1',

    //By default foo_controlserver uses '|' as a separator, change if needed.
    CONTROL_SERVER_MESSAGE_SEPARATOR: '|',

    //These actions correspond to buttons in UI. Defaults are what foobar supports and includes in it's native UI.
    foobarActions: [
        'playpause',
        'stop',
        'prev',
        'next',
        'rand'
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
