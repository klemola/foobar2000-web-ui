const Path = require('path');
const Express = require('express');
const Bunyan = require('bunyan');
const Minimist = require('minimist');
const Foobar = require('./Foobar');
const Server = require('./Server');
const ControlServer = require('./ControlServer');
 
const args = Minimist(process.argv.slice(2));
const configPath = args.configPath || '../Config';
const config = require(configPath);
const logger = Bunyan.createLogger({
    name: 'foobar2000-web-ui',
    streams: [{
        path: `${Path.resolve(__dirname, '..')}/foobar2000-web-ui.log`,
    }],
    serializers: Bunyan.stdSerializers,
});

Foobar.launch(config.foobarPath)
    .then(() => {
        logger.info('Foobar launched');
        return ControlServer.connect(config.controlServerPort, logger);
    })
    .then(client => {
        const context = {
            config,
            logger,
            client,
        };
        const app = Express();
        const {server, io} = Server.createServer(app);

        logger.info('Control server connected');

        Server.configureStatic(context, app);
        Server.configureWebsockets(context, io);

        server.listen(config.webServerPort);
        logger.info(`Server listening on port ${config.webServerPort}`);
    });





    
