/* global describe, it, expect */
describe('Foobar web UI server', function() {

	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	var websocketServer = require('../src/websocketServer');

	server.listen(9999);

	it('should initialize a websocket server', function(done) {
		var foobarServer = websocketServer(server);
		expect(foobarServer).toBeDefined();
		server.close();
		done();
	});
});

describe('parseMessage', function() {

	var parseMessage = require('../src/parseMessage');

	it('should parse an information block', function() {
		var lines = [
			'999|Connected to foobar2000 Control Server v1.0.1|',
			'999|Accepted client from 127.0.0.1|',
			'999|There are currently 2/10 clients connected|',
			'999|Type \'?\' or \'help\' for command information|'
		];
		var message = lines.join('\r\n');
		var expectedMessage = lines.join('\n') + '\n';
		var parsedMessage = parseMessage.parseControlData(message);

		expect(parsedMessage.info).toEqual(expectedMessage);
	});

	it('should parse a playback status message', function() {
		var message = '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		var expectedTrackData = {
			status: '111',
			secondsPlayed: '2.73',
			codec: 'FLAC',
			bitrate: '605',
			artist: 'Imaginary Friends',
			album: 'Bronchitis',
			date: '2013',
			genre: 'Post-rock',
			trackNumber: '01',
			track: 'Bronchitis (entire)',
			trackLength: '745',
			state: 'playing'
		};
		var parsedObject = parseMessage.parseControlData(message);

		expect(parsedObject.status).toEqual(expectedTrackData);
	});

	it('should set state "playing" for code "111"', function() {
		var message = '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		var parsedObject = parseMessage.parseControlData(message);

		expect(parsedObject.status.state).toEqual('playing');
	});

	it('should set state "stopped" for code "112"', function() {
		var message = '112|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		var parsedObject = parseMessage.parseControlData(message);

		expect(parsedObject.status.state).toEqual('stopped');
	});

	it('should set state "paused" for code "113"', function() {
		var message = '113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		var parsedObject = parseMessage.parseControlData(message);

		expect(parsedObject.status.state).toEqual('paused');
	});

	it('should parse volume change message', function() {
		var message = '222|-1.58|';
		var parsedObject = parseMessage.parseControlData(message);
		var mockVolumeResponse = {
			status: {
				volume: '-1.58'
			}
		};

		expect(parsedObject).toEqual(mockVolumeResponse);
	});
});
