import { getIPv4AddressList } from './IP'

export const appTitle = 'Foobar2000 Web UI'
export const localIPGuess = getIPv4AddressList()[0]

// defines whether local IP is parsed from network interfaces or set manually
export const guessIP = true

// foobar2000.exe location in your filesystem. Slash after last folder name optional.
export const foobarPath = 'C:/Program Files (x86)/foobar2000'

// foo_controlserver port (default is '3333' in component configuration).
export const controlServerPort = 3333

// Web UI port.
export const webServerPort = 3000

/* Defines the IP that is used to access the UI from your network (ex. 192.168.0.1).
 * By default the IP is parsed from network interfaces (see above), but it can also
 * be set up manually.
 */
export const serverExternalIP =
    guessIP && localIPGuess ? localIPGuess : '127.0.0.1'

// By default foo_controlserver uses '|' as a separator, change if needed.
export const controlServerMessageSeparator = '|'

/* These actions correspond to buttons in UI. Defaults are what foobar2000 supports
 * and includes in it's native UI.
 */
export const playbackActions = ['playpause', 'stop', 'prev', 'next', 'rand']

export const volumeActions = ['mute', 'voldown', 'volup']
