import * as path from 'path'
import bunyan from 'bunyan'
import * as net from 'net'

import * as Foobar from './Foobar'
import * as Server from './Server'
import * as ControlServer from './ControlServer'
import { Context } from './Models'
import * as config from './config'

const logger = bunyan.createLogger({
    name: 'foobar2000-web-ui',
    streams: [
        {
            path: `${path.resolve(__dirname, '..')}/foobar2000-web-ui.log`
        }
    ],
    level: bunyan.DEBUG,
    serializers: bunyan.stdSerializers
})

logger.debug(config, 'Initializing')

Foobar.launch(config)
    .then(() => {
        logger.debug('Foobar launched')
        return ControlServer.connect(config.controlServerPort, logger)
    })
    .then((client: net.Socket) => {
        const context: Context = {
            config,
            logger,
            client
        }
        const { server, app, io } = Server.create()

        Server.configureStatic(context, app)
        Server.configureWebsockets(context, io)

        server.listen(config.webServerPort)
        logger.debug('Initialization complete')
        logger.info(`Server listening on port ${config.webServerPort}`)
    })
    .catch((err: Error) => {
        if (err) {
            logger.error(err)
        }

        logger.error(
            'Could not initialize server and/or connect to control server. Make sure configuration is correct.'
        )
        process.exit(1)
    })
