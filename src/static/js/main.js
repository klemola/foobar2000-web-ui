var currentTrack;
var timer = $.timer(updateTrackTime, 1000, false);
var secondsPlayed = 0;
var foobarWasClosed = false;
var socket;
var FBUI = {};

$(document).ready(function() {
    setUIElements();
    initClient();
    $('#controls button').on('click touchend', sendCommand);
});

function formatTime(seconds) {
    var secondsToInt = parseInt(seconds, 10);
    var date = new Date(null);
    date.setSeconds(secondsToInt);
    var time = [pad(date.getMinutes()), pad(date.getSeconds())];
    if (date.getUTCHours()) time.unshift(date.getUTCHours());
    return time.join(':');
}

function initClient() {
    socket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);
    socket
        .on('foobarStatus', routeSocketMessage)
        .on('info', function(data) {
            console.log('Received INFO message\n' + data);
        })
        .on('controlServerError', function(data) {
            console.log('ERROR: ' + data);
            foobarWasClosed = true;
            updateConnectionStatus('disconnect', true);
            FBUI.launchFoobarButton.attr('disabled', false);
        })
        .on('foobarStarted', function() {
            FBUI.launchFoobarButton.html('Launch Foobar2000');
            socket.socket.reconnect();
        })
        .on('disconnect', function() {
            updateConnectionStatus('disconnect');
        })
        .on('reconnect', function() {
            updateConnectionStatus('reconnect');
            if (foobarWasClosed) {
                socket.emit('resetControlServer');
                foobarWasClosed = false;
            }
        });
}

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

function routeSocketMessage(message) {
    console.log('Received STATUS message', message);
    if (message.volume) {
        updateVolumeLevel(message.volume);
    } else {
        updatePlaybackStatus(message);
    }
}

function sendCommand(event) {
    event.preventDefault();
    var command = $(this).data().action;

    if (command === 'launchFoobar') {
        FBUI.launchFoobarButton.html('Starting...');
        FBUI.launchFoobarButton.attr('disabled', true);
    }

    socket.emit('foobarCommand', command);
    $(this).blur();
}

function setTrackTimer(status, trackData) {
    if (status === 'playing') {
        timer.play();
    } else if (status === 'paused' || status === 'stopped') {
        timer.stop();
    }

    secondsPlayed = (status !== 'stopped') ? parseInt(trackData.secondsPlayed, 10) : 0;
    updateTrackTime();
    FBUI.TrackTimer.trackLength.html(formatTime(trackData.trackLength));
}

function setUIElements() {
    FBUI.launchFoobarButton = $('#launchFoobar');
    FBUI.TrackInfo = {
        artist: $('#artist'),
        album: $('#album'),
        track: $('#track')
    };
    FBUI.TrackTimer = {
        secondsPlayed: $('#secondsPlayed'),
        trackLength: $('#trackLength')
    };
    FBUI.volumeLevelElement = $('#volumeLevel');
    FBUI.statusElement = $('#status');
    FBUI.statusTextElement = $('#statusText');
    FBUI.playPauseButton = $('#playpause');
}

function updateConnectionStatus(status, foobarClosed) {
    var disconnectMessage = 'Disconnected from server. Attempting to reconnect.';
    var foobarClosedMessage = 'Foobar2000 was closed.';
    var reconnectMessage = 'Reconnected to the server.';
    var classSuffix = (status === 'disconnect') ? 'danger' : 'success';

    FBUI.statusElement.attr('class', 'alert alert-' + classSuffix);

    if (status === 'disconnect') {
        timer.stop();
        FBUI.statusTextElement.html(foobarClosed ? foobarClosedMessage : disconnectMessage);
        FBUI.statusElement.fadeIn();
    } else if (status === 'reconnect') {
        FBUI.statusTextElement.html(reconnectMessage);
        socket.emit('updateStatus');
        setTimeout(function() {
            FBUI.statusElement.fadeOut();
        }, 4000);
    }
}

function updatePlaybackStatus(message) {
    var status = message.state;

    if (currentTrack !== message.track) {
        currentTrack = message.track;
        updateTrackInfo(message);
    }

    setTrackTimer(status, message);
    updatePlayBackControls(status);
}

function updatePlayBackControls(status) {
    var playPauseIconElement = FBUI.playPauseButton.find('span');
    //only 'paused' status needs special icon
    var playPauseIconSuffix = (status === 'playing') ? 'pause' : 'play';
    playPauseIconElement.removeClass('glyphicon-play glyphicon-pause');
    playPauseIconElement.addClass('glyphicon-' + playPauseIconSuffix);
}

function updateTrackInfo(trackData) {
    for (var key in FBUI.TrackInfo) {
        if (FBUI.TrackInfo.hasOwnProperty(key)) {
            FBUI.TrackInfo[key].html(trackData[key]);
        }
    }
    var trackNumberElement = $('<span>')
        .html(trackData.trackNumber + ' ')
        .addClass('track-number');
    FBUI.TrackInfo.track.prepend(trackNumberElement);
}

function updateTrackTime() {
    FBUI.TrackTimer.secondsPlayed.html(formatTime(secondsPlayed));
    secondsPlayed++;
}

function updateVolumeLevel(db) {
    FBUI.volumeLevelElement.html((db === '-100.00') ? 'Muted' : db + 'db');
}
