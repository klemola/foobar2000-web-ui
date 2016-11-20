/*
    Based on answer from http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
*/

var os = require('os');
var ifaces = os.networkInterfaces();
var IPList = [];

for (var dev in ifaces) {
    ifaces[dev].forEach(parseDetails);
}

function parseDetails(details) {
    if (details.family === 'IPv4') {
        IPList.push(details.address);
    }
}

exports.IPList = IPList;
