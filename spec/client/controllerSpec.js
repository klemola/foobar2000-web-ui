/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('FBUI Controllers', function () {
    var scope, interval;
    var playBackStatusMock = {
        status: {
            'status': '111',
            'secondsPlayed': '0',
            'codec': 'MP3',
            'bitrate': '320',
            'artist': 'The Range',
            'album': 'Nonfiction',
            'date': '2013',
            'genre': '?',
            'trackNumber': '07',
            'track': 'Hamiltonian',
            'trackLength': 225000,
            'state': 'stopped'
        },
        volumeLevel: '0.0db',
        setVolumeLevel: function() {
        }
    };

    beforeEach(function () {
        module('FBUIServices');
        module('FBUIControllers');
        inject(function ($rootScope, $controller, $interval) {
            scope = $rootScope;
            interval = $interval;
            $controller('PlayBackController', {
                $scope: scope,
                PlayBackStatus: playBackStatusMock
            });
        });
    });

    describe('PlayBackController', function () {

        it('should start the timer when playback status  is "playing"', function () {
            playBackStatusMock.status.state = 'playing';
            scope.$apply();
            interval.flush(2000);
            expect(scope.millisecondsPlayed).to.be.above(0);
        });

        it('should pause the timer when playback status is "paused"', function () {
            var millisecondsPlayed;
            playBackStatusMock.status.state = 'playing';
            scope.$apply();
            interval.flush(2000);
            playBackStatusMock.status.state = 'paused';
            scope.$apply();
            millisecondsPlayed = scope.millisecondsPlayed;
            playBackStatusMock.status.state = 'playing';
            interval.flush(2000);
            scope.$apply();
            expect(scope.millisecondsPlayed).to.be.greaterThan(millisecondsPlayed);
        });

        it('should stop the timer when playback status is "stopped"', function () {
            playBackStatusMock.status.state = 'playing';
            scope.$apply();
            expect(scope.millisecondsPlayed).to.be(0);
        });

    });


});
