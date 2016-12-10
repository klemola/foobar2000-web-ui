const os = require('os');

function getIPv4AddressList() {
    const eligibleInterfaces = os.networkInterfaces()['Local Area Connection'];

    if (!eligibleInterfaces) {
        return [];
    }

    return eligibleInterfaces
        .filter(i => i.family === 'IPv4')
        .map(i => i.address);
}

exports.getIPv4AddressList = getIPv4AddressList;
