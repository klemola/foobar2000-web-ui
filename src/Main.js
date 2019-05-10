/* eslint import/no-dynamic-require: off, promise/always-return: off */

const Path = require('path')
const Express = require('express')
const Bunyan = require('bunyan')
const Minimist = require('minimist')
const Foobar = require('./Foobar')
const Server = require('./Server')
const ControlServer = require('./ControlServer')

const args = Minimist(process.argv.slice(2))
const configPath = args.configPath || '../Config'
const config = require(configPath)
const logger = Bunyan.createLogger({
    name: 'foobar2000-web-ui',
    streams: [
        {
            path: `${Path.resolve(__dirname, '..')}/foobar2000-web-ui.log`
        }
    ],
    level: Bunyan.DEBUG,
    serializers: Bunyan.stdSerializers
})

logger.debug(config, 'Initializing')

Foobar.launch(config)
    .then(() => {
        logger.debug('Foobar launched')
        return ControlServer.connect(config.controlServerPort, logger)
    })
    .then(client => {
        const context = {
            config,
            logger,
            client
        }
        const app = Express()
        const { server, io } = Server.createServer(app)

        Server.configureStatic(context, app)
        Server.configureWebsockets(context, io)

        server.listen(config.webServerPort)
        logger.debug('Initialization complete')
        logger.info(`Server listening on port ${config.webServerPort}`)
    })
    .catch(err => {
        if (err) {
            logger.error(err)
        }

        logger.error(
            'Could not initialize server and/or connect to control server. Make sure configuration is correct.'
        )
        process.exit(1)
    })
