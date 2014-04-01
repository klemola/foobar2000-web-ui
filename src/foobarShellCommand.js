var exec = require('child_process').exec;
var fs = require('fs');
var config = require('../config.js');
var foobarPath = (config.FOOBAR_PATH.indexOf(config.FOOBAR_PATH.length - 1) === '/') ? config.FOOBAR_PATH : config.FOOBAR_PATH + '/';

if (fs.readdirSync(foobarPath).indexOf('foobar2000.exe') === -1) {
	throw 'Foobar2000.exe was not found in the path specified in config.js';
}

console.log('Found foobar2000 executable. Ready to send commands.');
console.log('----------------------------------------------------');

exports.sendCommand = function(command, callback) {
	var foobarCommand = 'foobar2000.exe /' + command;

	exec(
		foobarCommand, {
			cwd: foobarPath
		},
		callback
	);
};
