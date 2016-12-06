const Net = require('net');

function connect(port, logger) {
    return new Promise((resolve) => {
        const client = Net.connect({ port }, () => {
            client.setKeepAlive(true, 10000);

            client.on('end', () => {
                logger.info('Control server closed connection');
            });

            client.on('error', (e) => {
                logger.warn('Error in control server connection');
                logger.error(e);
            });

            return resolve(client);
        });
    });
};

function sendCommand(ctx, command) {
    try {
        ctx.client.write(`${command}\r\n`);
        ctx.logger.info(`Control server command sent for action ${command}`);
    } catch (error) {
        ctx.logger.warn('Could not reach control server');
        
        if (error) {
            ctx.logger.error(error);
        }
    }
};

exports.connect = connect;
exports.sendCommand = sendCommand;

