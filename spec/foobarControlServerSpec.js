/* global describe, it, expect */
describe('Foobar control server tests', function() {

	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	server.listen(9999);
	var controlServer = require('../src/foobarControlServer.js');


	it('should initialize a websocket server', function(done) {
		var foobarServer = controlServer.initialize(server);
		expect(foobarServer).toBeDefined();
		server.close();
		done();
	});
});
