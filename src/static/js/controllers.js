var FBUIControllers = angular.module('FBUIControllers', []);

FBUIControllers.controller('PlayBackController', [
    '$scope', 'PlayBackStatus',
    function($scope, PlayBackStatus) {
        $scope.status = PlayBackStatus;
    }
]);

FBUIControllers.controller('TrackInfoController', [
    '$scope', '$interval', 'PlayBackStatus',
    function($scope, $interval, PlayBackStatus) {
        $scope.currentTrack = null;
        $scope.millisecondsPlayed = 0;
        var timer;

        $scope.$on('currentTrack:change', function(event, args) {
            if ($scope.currentTrack && $scope.currentTrack.track !== args.newTrack) {
                $interval.cancel(timer);
            }
            $scope.currentTrack = PlayBackStatus.currentTrack;
        });

        $scope.$on('playBackStatus:change', function(event, args) {
            $scope.millisecondsPlayed = $scope.currentTrack.secondsPlayed * 1000;

            if (args.newStatus === 'playing') {
                timer = $interval(function() {
                    $scope.millisecondsPlayed += 1000;
                }, 1000);
            } else if (args.oldStatus === 'playing') {
                $interval.cancel(timer);
            }
        });
    }
]);

FBUIControllers.controller('ConnectivityController', [
    '$scope', 'ControlServerSocket', 'ConnectionStatus', 'PlayBackStatus',
    function($scope, ControlServerSocket, ConnectionStatus, PlayBackStatus) {
        $scope.disconnected = false;
        $scope.foobarIsClosed = false;

        $scope.sendCommand = function(action) {
            if (action === 'launchFoobar') {
                ConnectionStatus.setFoobarStatus(true);
            }

            ControlServerSocket.emit('foobarCommand', action);
        };

        $scope.$on('disconnected:change', function() {
            $scope.disconnected = ConnectionStatus.disconnected;
        });

        $scope.$on('foobarIsClosed:change', function() {
            $scope.foobarIsClosed = ConnectionStatus.foobarIsClosed;
        });

        ControlServerSocket.on('info', onInfo);
        ControlServerSocket.on('disconnect', disconnectedFromServer);
        ControlServerSocket.on('reconnect', reconnectedToServer);
        ControlServerSocket.on('controlServerError', onError);
        ControlServerSocket.on('foobarStarted', foobarWasStarted);
        ControlServerSocket.on('foobarStatus', onFoobarStatusChange);

        function disconnectedFromServer() {
            ConnectionStatus.setConnectionStatus(false);
            PlayBackStatus.setPlayBackStatus('stopped');
        }

        function foobarWasStarted() {
            ConnectionStatus.setConnectionStatus(true);
        }

        function onInfo(data) {
            console.log('Received INFO message\n' + data);
        }

        function onError(data) {
            console.log('ERROR: ' + data);
            ConnectionStatus.setConnectionStatus(false);
            ConnectionStatus.setFoobarStatus(false);
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

        function reconnectedToServer() {
            ConnectionStatus.setConnectionStatus(true);

            if ($scope.foobarIsClosed) {
                ControlServerSocket.emit('resetControlServer');
            }
        }
    }
]);
