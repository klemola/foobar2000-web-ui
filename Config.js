const IP = require('./src/IP');

const appTitle = 'Foobar2000 Webui';
const localIPGuess = IP.getIPv4AddressList[0];

// defines whether local IP is parsed from network interfaces or set manually
const guessIP = true;

// foobar2000.exe location in your filesystem. Slash after last folder name optional.
const foobarPath = 'C:/Program Files (x86)/foobar2000';

// foo_controlserver port (default is '3333' in component configuration).
const controlServerPort = 3333;

// Web UI port.
const webServerPort = 3000;

/* Defines the IP that is used to access the UI from your network (ex. 192.168.0.1).
 * By default the IP is parsed from network interfaces (see above), but it can also
 * be set up manually.
 */
const serverExternalIP = (guessIP && localIPGuess) ? localIPGuess : '127.0.0.1';

// By default foo_controlserver uses '|' as a separator, change if needed.
const controlServerMessageSeparator = '|';

/* These actions correspond to buttons in UI. Defaults are what Foobar2000 supports
 * and includes in it's native UI.
 */
const playbackActions = [
    'playpause',
    'stop',
    'prev',
    'next',
    'rand',
];

const volumeActions = [
    'mute',
    'voldown',
    'volup',
];


module.exports = {
    appTitle,
    foobarPath,
    controlServerPort,
    webServerPort,
    serverExternalIP,
    controlServerMessageSeparator,
    playbackActions,
    volumeActions,
};
