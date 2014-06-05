'use strict';

var FBUIControllers = angular.module('FBUIControllers', []);

FBUIControllers.controller('PlayBackController', [
    '$scope', 'PlayBackStatus',
    function($scope, PlayBackStatus) {
        $scope.foobarStatus = PlayBackStatus;
    }
]);

FBUIControllers.controller('TrackInfoController', [
    '$scope', '$interval', 'PlayBackStatus',
    function($scope, $interval, PlayBackStatus) {
        $scope.currentTrack = null;
        $scope.millisecondsPlayed = 0;
        var timer;

        $scope.$on('currentTrack:change', function() {
            if ($scope.currentTrack) {
                $interval.cancel(timer);
            }
            $scope.currentTrack = PlayBackStatus.currentTrack;
        });

        $scope.$on('playBackStatus:change', function(event, data) {
            $scope.millisecondsPlayed = data.secondsPlayed * 1000;
            $interval.cancel(timer);

            if (data.newStatus === 'playing') {
                timer = $interval(function() {
                    $scope.millisecondsPlayed += 1000;
                }, 1000);
            }
        });
    }
]);

FBUIControllers.controller('ConnectivityController', [
    '$scope', 'ControlServerSocket', 'ConnectionStatus', 'PlayBackStatus',
    function($scope, ControlServerSocket, ConnectionStatus, PlayBackStatus) {
        $scope.connectionStatus = ConnectionStatus;

        $scope.sendCommand = function(action) {
            ControlServerSocket.emit('foobarCommand', action);
        };

        ControlServerSocket.on('info', onInfo);
        ControlServerSocket.on('disconnect', disconnectedFromServer);
        ControlServerSocket.on('reconnect', reconnectedToServer);
        ControlServerSocket.on('controlServerError', onError);
        ControlServerSocket.on('foobarStarted', onFoobarStarted);
        ControlServerSocket.on('foobarStatus', onFoobarStatusChange);

        function disconnectedFromServer() {
            ConnectionStatus.setDisconnected(true);
            PlayBackStatus.setPlayBackStatus('stopped');
        }

        function onInfo(data) {
            console.log('Received INFO message\n' + data);
        }

        function onError(data) {
            console.log('ERROR: ' + data);
            ConnectionStatus.setDisconnected(true);
            ConnectionStatus.setFoobarIsClosed(true);
            PlayBackStatus.setPlayBackStatus('stopped');
        }

        function onFoobarStatusChange(message) {
            console.log('Received STATUS message', message);

            if (message.volume) {
                PlayBackStatus.setVolumeLevel(message.volume);
            } else {
                PlayBackStatus.setPlayBackStatus(message);
            }
        }

        function onFoobarStarted() {
            reconnectedToServer();
            ConnectionStatus.setFoobarIsClosed(false);
            ControlServerSocket.emit('resetControlServer');
        }

        function reconnectedToServer() {
            ConnectionStatus.setDisconnected(false);
        }
    }
]);
