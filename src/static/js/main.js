$(document).ready(function() {

    var playPauseButton = $('#playpause');
    var trackInfo = {
        artist: $('#artist'),
        album: $('#album'),
        track: $('#track')
    };
    var volumeLevelElement = $('#volumeLevel');
    var trackTimer = {
        secondsPlayed: $('#secondsPlayed'),
        trackLength: $('#trackLength')
    };
    var launchFoobarButton = $('#launchFoobar');
    var currentTrack;
    var timer = $.timer(updateTrackTime, 1000, false);
    var secondsPlayed = 0;
    var foobarWasClosed = false;

    var socket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);
    socket.on('foobarStatus', routeSocketMessage)
        .on('info', function(data) {
            console.log('Received INFO message\n' + data);
        })
        .on('controlServerError', function(data) {
            console.log('ERROR: ' + data);
            foobarWasClosed = true;
            updateConnectionStatus('disconnect', true);
            launchFoobarButton.attr('disabled', false);
        })
        .on('foobarStarted', function() {
            launchFoobarButton.html('Launch Foobar2000');
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

    $('#controls button').on('click touchend', function(event) {
        event.preventDefault();
        var command = $(this).data().action;

        if (command === 'launchFoobar') {
            launchFoobarButton.html('Starting...');
            launchFoobarButton.attr('disabled', true);
        }

        socket.emit('foobarCommand', command);
        $(this).blur();
    });

    function routeSocketMessage(message) {
        console.log('Received STATUS message', message);
        if (message.volume) {
            updateVolumeLevel(message.volume);
        } else {
            updatePlaybackStatus(message);
        }
    }

    function updateConnectionStatus(status, foobarClosed) {
        var disconnectMessage = 'Disconnected from server. Attempting to reconnect.';
        var foobarClosedMessage = 'Foobar2000 was closed.';
        var reconnectMessage = 'Reconnected to the server.';
        var statusElement = $('#status');
        var statusTextElement = $('#statusText');
        var classSuffix = (status === 'disconnect') ? 'danger' : 'success';

        statusElement.attr('class', 'alert alert-' + classSuffix);

        if (status === 'disconnect') {
            timer.stop();
            statusTextElement.html(foobarClosed ? foobarClosedMessage : disconnectMessage);
            statusElement.fadeIn();
        } else if (status === 'reconnect') {
            statusTextElement.html(reconnectMessage);
            socket.emit('updateStatus');
            setTimeout(function() {
                statusElement.fadeOut();
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
        var playPauseIconElement = playPauseButton.find('span');
        //only 'paused' status needs special icon
        var playPauseIconSuffix = (status === 'playing') ? 'pause' : 'play';
        playPauseIconElement.removeClass('glyphicon-play glyphicon-pause');
        playPauseIconElement.addClass('glyphicon-' + playPauseIconSuffix);
    }

    function updateTrackInfo(trackData) {
        for (var key in trackInfo) {
            if (trackInfo.hasOwnProperty(key)) {
                trackInfo[key].html(trackData[key]);
            }
        }
        var trackNumberElement = $('<span>').html(trackData.trackNumber + ' ').addClass('track-number');
        $('#track').prepend(trackNumberElement);
    }

    function setTrackTimer(status, trackData) {
        if (status === 'playing') {
            timer.play();
        } else if (status === 'paused' || status === 'stopped') {
            timer.stop();
        }

        secondsPlayed = (status !== 'stopped') ? parseInt(trackData.secondsPlayed, 10) : 0;
        updateTrackTime();
        trackTimer.trackLength.html(formatTime(trackData.trackLength));
    }

    function updateTrackTime() {
        trackTimer.secondsPlayed.html(formatTime(secondsPlayed));
        secondsPlayed++;
    }

    function updateVolumeLevel(db) {
        volumeLevelElement.html((db === '-100.00') ? 'Muted' : db + 'db');
    }

    function formatTime(seconds) {
        var secondsToInt = parseInt(seconds, 10);
        var date = new Date(null);
        date.setSeconds(secondsToInt);
        var time = [pad(date.getMinutes()), pad(date.getSeconds())];
        if (date.getUTCHours()) time.unshift(date.getUTCHours());
        return time.join(':');
    }

});

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}
