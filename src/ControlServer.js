const Net = require('net');

const connectionError = new Error('Could not connect to control server');

function probe(port) {
    return new Promise((resolve, reject) => {
        const sock = new Net.Socket();

        sock.setTimeout(10000);

        sock.on('connect', function() {
            sock.destroy();
            return resolve();
        })

        sock.on('error', function(e) {
            return reject(connectionError);
        })

        sock.on('timeout', function(e) {
            return reject(connectionError);
        })

        sock.connect(port, '127.0.0.1');
    });
}

function connect(port, logger) {
    return new Promise((resolve) => {
        const client = Net.connect({ port }, () => {
            client.setKeepAlive(true, 10000);

            client.on('end', () => {
                // TODO: reconnect automatically
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

exports.probe = probe;
exports.connect = connect;
exports.sendCommand = sendCommand;

