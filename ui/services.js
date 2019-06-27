'use strict'

var FBUIServices = angular.module('FBUIServices', [])

FBUIServices.factory('ConnectionManager', [
    'serverInfo',
    'socketFactory',
    'PlayBackStatus',
    function(serverInfo, socketFactory, playBackStatus) {
        var IOSocket = io.connect(
            'http://' + serverInfo.address + ':' + serverInfo.port
        )
        var disconnected = false
        var foobarIsClosed = false

        var appSocket = socketFactory({
            ioSocket: IOSocket
        })

        appSocket.on('info', onInfo)
        appSocket.on('disconnect', disconnectedFromServer)
        appSocket.on('reconnect', reconnectedToServer)
        appSocket.on('controlServerError', onError)
        appSocket.on('foobarStarted', onFoobarStarted)
        appSocket.on('foobarStatus', onFoobarStatusChange)

        function disconnectedFromServer() {
            disconnected = true
            playBackStatus.status.state = 'stopped'
        }

        function onInfo(data) {
            console.log('Received INFO message\n' + data)
        }

        function onError(data) {
            console.log('ERROR: ' + data)
            disconnected = true
            foobarIsClosed = true
            playBackStatus.status.state = 'stopped'
        }

        function onFoobarStatusChange(message) {
            console.log('Received STATUS message', message)
            if (message.volume) {
                playBackStatus.setVolumeLevel(message.volume)
            } else {
                var modifiedStatus = message
                modifiedStatus.trackLength = message.trackLength * 1000
                playBackStatus.status = modifiedStatus
            }
        }

        function onFoobarStarted() {
            reconnectedToServer()
            foobarIsClosed = true
            appSocket.emit('resetControlServer')
        }

        function reconnectedToServer() {
            disconnected = false
        }

        return {
            socket: appSocket,
            disconnected: disconnected,
            foobarIsClosed: foobarIsClosed
        }
    }
])

FBUIServices.factory('PlayBackStatus', [
    function() {
        return {
            status: null,
            volumeLevel: '0.0db',
            setVolumeLevel: function(db) {
                this.volumeLevel = db === '-100.00' ? 'Muted' : db + 'db'
            }
        }
    }
])
