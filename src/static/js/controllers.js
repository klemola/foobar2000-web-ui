var FBUIControllers = angular.module('FBUIControllers', []);

FBUIControllers.controller('UIController', [
    '$scope', '$interval', 'ControlServerSocket',
    function($scope, $interval, ControlServerSocket) {
        $scope.disconnected = false;
        $scope.foobarIsClosed = false;
        $scope.millisecondsPlayed = 0;
        $scope.playBackStatus = 'stopped';
        $scope.volumeLevel = '0.0db';
        $scope.currentTrack = {};
        var timer;

        $scope.$watch('playBackStatus', function(newValue, oldValue) {
            if (newValue === 'playing') {
                timer = $interval(function() {
                    $scope.millisecondsPlayed += 1000;
                }, 1000);
            } else if (oldValue === 'playing') {
                $interval.cancel(timer);
            }
        });

        ControlServerSocket.on('foobarStatus', onFoobarStatusChange);
        ControlServerSocket.on('info', onInfo);
        ControlServerSocket.on('controlServerError', onError);
        ControlServerSocket.on('foobarStarted', foobarWasStarted);
        ControlServerSocket.on('disconnect', disconnectedFromServer);
        ControlServerSocket.on('reconnect', reconnectedToServer);

        $scope.sendCommand = function(action) {
            if (action === 'launchFoobar') {
                $scope.foobarIsClosed = false;
            }

            ControlServerSocket.emit('foobarCommand', action);
        };

        function disconnectedFromServer() {
            $scope.disconnected = true;
            $scope.playBackStatus = 'stopped';
        }

        function foobarWasStarted() {
            $scope.disconnected = false;
        }

        function onFoobarStatusChange(message) {
            console.log('Received STATUS message', message);

            if (message.volume) {
                var db = message.volume;
                $scope.volumeLevel = (db === '-100.00') ? 'Muted' : db + 'db';
            } else {
                updatePlaybackStatus(message);
            }
        }

        function onInfo(data) {
            console.log('Received INFO message\n' + data);
        }

        function onError(data) {
            console.log('ERROR: ' + data);
            $scope.disconnected = true;
            $scope.foobarIsClosed = true;
            $scope.playBackStatus = 'stopped';
        }

        function reconnectedToServer() {
            $scope.disconnected = false;

            if ($scope.foobarIsClosed) {
                ControlServerSocket.emit('resetControlServer');
            }
        }

        function updatePlaybackStatus(message) {
            $scope.millisecondsPlayed = parseInt(message.secondsPlayed, 10) * 1000;

            if ($scope.currentTrack.track !== message.track) {
                $scope.currentTrack = message;
                $scope.currentTrack.trackLength = parseInt(message.trackLength, 10) * 1000;
            }

            if ($scope.playBackStatus !== message.state) {
                $scope.playBackStatus = message.state;
            }
        }
    }
]);
