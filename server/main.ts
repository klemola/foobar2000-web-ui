import * as net from 'net'

import * as Logger from './Logger'
import * as Foobar from './Foobar'
import * as Server from './Server'
import * as ControlServer from './ControlServer'
import { Context } from './Models'
import config from './config'

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
