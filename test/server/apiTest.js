const assert = require('chai').assert;
const express = require('express');
const websocketServer = require('../../src/websocketServer');

describe('API', () => {
	let server;
	let io;

	before(() => {
		const app = express();
		server = require('http').createServer(app);
		io = websocketServer.configure(server);

		server.listen(9999);
	});

	after(() => {
		server.close();
	});

	it('should initialize a websocket server', (done) => {
		assert.deepEqual(io.engine.transports.sort(), ['polling', 'websocket']);
		done();
	});
});
