'use strict';

var FBUIControllers = angular.module('FBUIControllers', []);

FBUIControllers.controller('PlayBackController', [
    '$scope', 'PlayBackStatus',
    function($scope, playBackStatus) {
        $scope.foobarStatus = playBackStatus;
    }
]);

FBUIControllers.controller('TrackInfoController', [
    '$scope', '$interval', 'PlayBackStatus',
    function($scope, $interval, playBackStatus) {
        $scope.currentTrack = null;
        $scope.millisecondsPlayed = 0;
        var timer;

        $scope.$on('currentTrack:change', function() {
            if ($scope.currentTrack) {
                $interval.cancel(timer);
            }
            $scope.currentTrack = playBackStatus.currentTrack;
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
    '$scope', 'ControlServerSocket', 'ConnectionStatus',
    function($scope, controlServerSocket, connectionStatus) {
        $scope.connectionStatus = connectionStatus;

        $scope.sendCommand = function(action) {
            controlServerSocket.emit('foobarCommand', action);
        };
    }
]);
