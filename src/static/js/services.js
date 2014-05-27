var FBUIServices = angular.module('FBUIServices', []);

FBUIServices.factory('ControlServerSocket', function(socketFactory) {
    var IOSocket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);

    var appSocket = socketFactory({
        ioSocket: IOSocket
    });

    return appSocket;
});
