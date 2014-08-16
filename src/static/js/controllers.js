'use strict';

var FBUIControllers = angular.module('FBUIControllers', []);

FBUIControllers.controller('PlayBackController', [
    '$scope', '$interval', 'PlayBackStatus',
    function($scope, $interval, playBackStatus) {
        var timer;
        $scope.playBackStatus = playBackStatus;
        $scope.millisecondsPlayed = 0;

        $scope.$watch('playBackStatus.status', function(updatedStatus, oldStatus) {
            if(updatedStatus !== null){
                $scope.millisecondsPlayed = updatedStatus.secondsPlayed * 1000;
                $interval.cancel(timer);

                if (updatedStatus.state === 'playing') {
                    timer = $interval(function() {
                        $scope.millisecondsPlayed += 1000;
                    }, 1000);
                }
            }
        });
    }
]);

FBUIControllers.controller('ConnectivityController', [
    '$scope', 'ConnectionManager',
    function($scope, connectionManager) {
        $scope.connectionStatus = connectionManager;

        $scope.sendCommand = function(action) {
            connectionManager.socket.emit('foobarCommand', action);
        };
    }
]);
