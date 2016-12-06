const assert = require('chai').assert;
const Path = require('path');
const Bunyan = require('bunyan');
const Server = require('../../src/Server');
const ControlServer = require('../../src/ControlServer');

describe('API', () => {
	let testServer;
	let ioInstance;

	before(done => {
		const config = require('../../Config');
		const logger = Bunyan.createLogger({
			name: 'foobar2000-web-ui-test',
			serializers: Bunyan.stdSerializers,
			streams: [{
				path: `${Path.resolve(__dirname, '..')}/test.log`,
			}],
		});

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
		testServer.close();
	});

	it('should initialize a websocket server', (done) => {
		assert.deepEqual(ioInstance.engine.transports.sort(), ['polling', 'websocket']);
		done();
	});
});
