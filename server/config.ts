import { getIPv4AddressList } from './IP'
import { Config, Env } from 'Models'

const appTitle = 'Foobar2000 Web UI'
const localIPGuess = getIPv4AddressList()[0]

// defines whether local IP is parsed from network interfaces or set manually
const guessIP = true

// foobar2000.exe location in your filesystem. Slash after last folder name optional.
const foobarPath = 'C:/Program Files (x86)/foobar2000'

// foo_controlserver port (default is '3333' in component configuration).
const controlServerPort = 3333

// Web UI port.
const webServerPort = 3000

/* Defines the IP that is used to access the UI from your network (ex. 192.168.0.1).
 * By default the IP is parsed from network interfaces (see above), but it can also
 * be set up manually.
 */
const serverExternalIP = guessIP && localIPGuess ? localIPGuess : '127.0.0.1'

// By default foo_controlserver uses '|' as a separator, change if needed.
const controlServerMessageSeparator = '|'

let environment: Env = 'development'

if (process.env.NODE_ENV === 'production') {
    environment = 'production'
}

const config: Config = {
    appTitle,
    localIPGuess,
    guessIP,
    foobarPath,
    controlServerPort,
    webServerPort,
    serverExternalIP,
    controlServerMessageSeparator,
    environment
}

export default config
