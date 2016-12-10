const assert = require('chai').assert;
const Message = require('../../src/Message');

describe('Message', () => {
	it('should parse an information block', () => {
		const lines = [
			'999|Connected to foobar2000 Control Server v1.0.1|',
			'999|Accepted client from 127.0.0.1|',
			'999|There are currently 2/10 clients connected|',
			'999|Type \'?\' or \'help\' for command information|'
		];
		const message = lines.join('\r\n');
		const expectedMessage = lines.join('\n');
		const parsedMessage = Message.parseControlData(message);

		assert.equal(parsedMessage[0].content, expectedMessage);
	});

	it('should parse a playback status message', () => {
		const message = '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		const expectedTrackData = {
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
		const parsedObject = Message.parseControlData(message);

		assert.deepEqual(parsedObject[0].status, expectedTrackData);
	});

	it('should set state "playing" for code "111"', () => {
		const message = '111|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		const parsedObject = Message.parseControlData(message);

		assert.equal(parsedObject[0].status.state, 'playing');
	});

	it('should set state "stopped" for code "112"', () => {
		const message = '112|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		const parsedObject = Message.parseControlData(message);

		assert.equal(parsedObject[0].status.state, 'stopped');
	});

	it('should set state "paused" for code "113"', () => {
		const message = '113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|01|Bronchitis (entire)|745|';
		const parsedObject = Message.parseControlData(message);

		assert.equal(parsedObject[0].status.state, 'paused');
	});

	it('should parse volume change message', () => {
		const message = '222|-1.58|';
		const parsedObject = Message.parseControlData(message);
		const mockStatus = {
			volume: '-1.58'
		};

		assert.deepEqual(parsedObject[0].status, mockStatus);
	});
});
