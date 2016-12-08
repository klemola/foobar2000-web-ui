const assert = require('chai').assert;
const Path = require('path');
const Bunyan = require('bunyan');
const _ = require('lodash/fp');
const MockControlServer = require('../util/MockControlServer');
const Server = require('../../src/Server');
const ControlServer = require('../../src/ControlServer');

describe('API', () => {
    const testPort = 9999;
    let mockControlServer;
	let testServer;
	let ioInstance;

	before(done => {
		const config = _.merge(
            require('../../Config'),
            { controlServerPort: testPort }
        );
		const logger = Bunyan.createLogger({
			name: 'foobar2000-web-ui-test',
			serializers: Bunyan.stdSerializers,
			streams: [{
				path: `${Path.resolve(__dirname, '..')}/test.log`,
			}],
		});
        mockControlServer = MockControlServer.createServer('127.0.0.1', testPort);

		ControlServer.connect(config.controlServerPort, logger)
			.then(client => {
				const context = {
					config,
					logger,
					client,
				};

				const {server, io} = Server.createServer();
				Server.configureWebsockets(context, io);

				ioInstance = io;
				testServer = server;
				testServer.listen(9999);
				done();
			})
	});

	after(() => {
        mockControlServer.close();
		testServer.close();
	});

	it('should initialize a websocket server', (done) => {
		assert.deepEqual(ioInstance.engine.transports.sort(), ['polling', 'websocket']);
		done();
	});
});
