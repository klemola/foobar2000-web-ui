/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('FBUI Controllers', function() {

    beforeEach(module('FBUIServices'));
    beforeEach(module('FBUIControllers'));

    describe('PlayBackController', function() {

        it('should have default values from PlayBackStatus service in $scope',
            inject(function($rootScope, $controller) {
                var scope = $rootScope.$new();
                var ctrl = $controller('PlayBackController', {
                    $scope: scope
                });

                expect(scope.foobarStatus.currentTrack).to.be(null);
                expect(scope.foobarStatus.playBackStatus).to.be('stopped');
                expect(scope.foobarStatus.volumeLevel).to.be('0.0db');
            })
        );
    });

});
