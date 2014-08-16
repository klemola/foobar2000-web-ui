/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('FBUI Controllers', function () {
    var scope;
    var connectionManagerMock = {
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
    }

    beforeEach(function () {
        module('FBUIServices');
        module('FBUIControllers');
        inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            $controller('PlayBackController', {
                $scope: scope,
                ConnectionManager: connectionManagerMock
            });
        });
    });

    describe('PlayBackController', function () {

        it('should start the timer when playback status is "playing"', function () {

        });

        it('should pause the timer when playback status is "paused"', function () {

        });

        it('should stop the timer when playback status is "stopped"', function () {

        });

    });


});
