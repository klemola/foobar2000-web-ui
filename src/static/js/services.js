'use strict';

var FBUIServices = angular.module('FBUIServices', []);

FBUIServices.factory('ControlServerSocket', [
    'socketFactory', 'ConnectionStatus', 'PlayBackStatus',
    function(socketFactory, connectionStatus, playBackStatus) {
    var IOSocket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);

    var appSocket = socketFactory({
        ioSocket: IOSocket
    });

    appSocket.on('info', onInfo);
    appSocket.on('disconnect', disconnectedFromServer);
    appSocket.on('reconnect', reconnectedToServer);
    appSocket.on('controlServerError', onError);
    appSocket.on('foobarStarted', onFoobarStarted);
    appSocket.on('foobarStatus', onFoobarStatusChange);

    function disconnectedFromServer() {
        connectionStatus.setDisconnected(true);
        playBackStatus.setPlayBackStatus('stopped');
    }

    function onInfo(data) {
        console.log('Received INFO message\n' + data);
    }

    function onError(data) {
        console.log('ERROR: ' + data);
        connectionStatus.setDisconnected(true);
        connectionStatus.setFoobarIsClosed(true);
        playBackStatus.setPlayBackStatus('stopped');
    }

    function onFoobarStatusChange(message) {
        console.log('Received STATUS message', message);
        if (message.volume) {
            playBackStatus.setVolumeLevel(message.volume);
        } else {
            playBackStatus.setPlayBackStatus(message);
        }
    }

    function onFoobarStarted() {
        reconnectedToServer();
        connectionStatus.setFoobarIsClosed(false);
        appSocket.emit('resetControlServer');
    }

    function reconnectedToServer() {
        connectionStatus.setDisconnected(false);
    }

    return appSocket;
}]);

FBUIServices.factory('ConnectionStatus', ['$rootScope', function($rootScope) {
    return {
        disconnected: false,
        foobarIsClosed: false,
        setFoobarIsClosed: function(isClosed) {
            this.foobarIsClosed = isClosed;
            $rootScope.$broadcast('foobarIsClosed:change');
        },
        setDisconnected: function(isDisconnected) {
            this.disconnected = isDisconnected;
            $rootScope.$broadcast('disconnected:change');
        }
    };
}]);

FBUIServices.factory('PlayBackStatus', ['$rootScope', function($rootScope) {
    return {
        currentTrack: null,
        playBackStatus: 'stopped',
        volumeLevel: '0.0db',

        setCurrentTrack: function(track) {
            this.currentTrack = track;
            $rootScope.$broadcast('currentTrack:change');
        },

        setPlayBackStatus: function(updatedStatus) {
            var oldStatus = this.playBackStatus;
            var currentTrack = this.currentTrack;

            if (!currentTrack || currentTrack.track !== updatedStatus.track) {
                var modifiedStatus = updatedStatus;
                modifiedStatus.trackLength = parseInt(updatedStatus.trackLength, 10) * 1000;
                this.setCurrentTrack(modifiedStatus);
            }

            if (oldStatus.playBackStatus !== updatedStatus.state) {
                this.playBackStatus = updatedStatus.state;
                $rootScope.$broadcast('playBackStatus:change', {
                    newStatus: this.playBackStatus,
                    secondsPlayed: updatedStatus.secondsPlayed
                });
            }
        },

        setVolumeLevel: function(db) {
            this.volumeLevel = (db === '-100.00') ? 'Muted' : db + 'db';
            $rootScope.$broadcast('volumeLevel:change');
        }
    };
}]);
