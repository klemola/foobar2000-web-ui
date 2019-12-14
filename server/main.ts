import * as Logger from './Logger'
import * as Foobar from './Foobar'
import * as Server from './Server'
import * as ControlServer from './ControlServer'
import { Context, Env, Config } from './Models'

const DEFAULT_FOOBAR_PATH = 'C:/Program Files (x86)/foobar2000'
// foo_controlserver port (default is '3333' in component configuration).
const DEFAULT_CONTROL_SERVER_PORT = 3333
// Web UI port.
const DEFAULT_WEBSERVER_PORT = 3000
// By default foo_controlserver uses '|' as a separator
const controlServerMessageSeparator = '|'
const environment: Env = Env.guard(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'production'
const config: Config = {
    foobarPath: DEFAULT_FOOBAR_PATH,
    controlServerPort: DEFAULT_CONTROL_SERVER_PORT,
    webserverPort: DEFAULT_WEBSERVER_PORT,
    controlServerMessageSeparator,
    environment
}
const logger = Logger.create(config.environment)

logger.debug('Initializing', config)

Foobar.launch(config, logger)
    .then(instance => {
        logger.debug('Foobar launched')
        return Promise.all([
            instance,
            ControlServer.connect(config.controlServerPort, logger)
        ])
    })
    .then(([instance, client]) => {
        const context: Context = {
            config,
            logger,
            client,
            instance
        }
        const { server, app, io } = Server.create()

        Server.configureStatic(context, app)
        Server.configureWebsockets(context, io)

        setInterval(() => Foobar.queryTrackInfo(context, io), 1000)
        server.listen(config.webserverPort)
        logger.debug('Initialization complete')
        logger.info(`Server listening on port ${config.webserverPort}`)
    })
    .catch((err: Error) => {
        logger.error(
            'Could not initialize server and/or connect to control server. Make sure the configuration is correct.',
            err
        )
        process.exit(1)
    })
