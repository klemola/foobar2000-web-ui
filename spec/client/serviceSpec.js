/* global describe, it, expect, beforeEach, inject */
'use strict';

describe('ConnectionManager service', function() {
    var connectionManager;
    var socketEventWatchers = {}
    var socketFactoryMock = function(){
        return {
            on: function(event, func){
                socketEventWatchers[event] = func;
            },
            emit:function(){}
        };
    };

    beforeEach(function() {
        module('FBUIServices');
        module(function($provide){
            $provide.value('socketFactory', socketFactoryMock);
            $provide.value('serverInfo', {
                address: '127.0.0.1',
                port: 3000
            });
        })
        inject(function(_ConnectionManager_) {
            connectionManager = _ConnectionManager_;
        });
    });

    it('should initialize connection status as connected', function(){
       expect(connectionManager.disconnected).to.be(false);
       expect(connectionManager.foobarIsClosed).to.be(false);
    });

    it('should register socket events', function(){
        expect(Object.keys(socketEventWatchers).length).to.be(6);
    });
});
