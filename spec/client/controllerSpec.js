/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('FBUI Controllers', function() {
    var scope;

    beforeEach(function() {
        module('FBUIServices');
        module('FBUIControllers');
        inject(function($rootScope) {
            scope = $rootScope.$new();
        });
    });

    describe('PlayBackController', function() {

        it('should have default values from PlayBackStatus service in $scope',
            inject(function($controller) {

                $controller('PlayBackController', {
                    $scope: scope
                });

                expect(scope.foobarStatus.currentTrack).to.be(null);
                expect(scope.foobarStatus.playBackStatus).to.be('stopped');
                expect(scope.foobarStatus.volumeLevel).to.be('0.0db');
            })
        );
    });

    describe('TrackInfoController', function() {

        it('should start the timer when playback status is "playing"', function(){

        });

        it('should pause the timer when playback status is "paused"', function(){

        });

        it('should stop the timer when playback status is "stopped"', function(){

        });

    });


});
