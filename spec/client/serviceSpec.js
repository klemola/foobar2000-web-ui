/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('ConnectionStatus service', function() {
    var ConnectionStatus;

    beforeEach(function() {
        module('FBUIServices');
        inject(function(_ConnectionStatus_) {
            ConnectionStatus = _ConnectionStatus_;
        });
    });

    it('should initialize connection status as connected', function(){
       expect(ConnectionStatus.disconnected).to.be(false);
       expect(ConnectionStatus.foobarIsClosed).to.be(false);
    });
});
