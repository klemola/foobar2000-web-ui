var FBUIServices = angular.module('FBUIServices', []);

FBUIServices.factory('ControlServerSocket', function(socketFactory) {
    var IOSocket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);

    var appSocket = socketFactory({
        ioSocket: IOSocket
    });

    return appSocket;
});

FBUIServices.factory('ConnectionStatus', function($rootScope) {
    var status = {
        disconnected: false,
        foobarIsClosed: false,
        setFoobarStatus: function(isOpen) {
            this.foobarIsClosed = !isOpen;
            $rootScope.$broadcast('foobarIsClosed:change');
        },
        setConnectionStatus: function(isConnected) {
            this.disconnected = !isConnected;
            $rootScope.$broadcast('disconnected:change');
        }
    };

    return status;
});

FBUIServices.factory('PlayBackStatus', function($rootScope) {
    var status = {
        currentTrack: null,
        playBackStatus: 'stopped',
        volumeLevel: '0.0db',

        setCurrentTrack: function(track) {
            this.currentTrack = track;
            $rootScope.$broadcast('currentTrack:change', {
                newTrack: track.track
            });
        },

        setPlayBackStatus: function(updatedStatus) {
            var oldStatus = this.playBackStatus;
            this.playBackStatus = updatedStatus;
            $rootScope.$broadcast('playBackStatus:change', {
                newStatus: updatedStatus,
                oldStatus: oldStatus
            });
        },

        setVolumeLevel: function(db) {
            this.volumeLevel = (db === '-100.00') ? 'Muted' : db + 'db';
            $rootScope.$broadcast('volumeLevel:change');
        }
    };

    return status;
});
