$(document).ready(function() {

    var API_PATH = '/command';
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
    var currentTrack;
    var timer = $.timer(updateTrackTime, 1000, false);
    var secondsPlayed = 0;

    var socket = io.connect('http://' + SERVER_ADDRESS + ':' + SERVER_PORT);
    socket.on('foobarStatus', routeSocketMessage)
        .on('info', function(data) {
            console.log('Received INFO message\n' + data);
        })
        .on('disconnect', function() {
            updateConnectionStatus('disconnect');
        })
        .on('reconnect', function() {
            updateConnectionStatus('reconnect');
        });

    $('button').on('click touchend', function(event) {
        event.preventDefault();
        var action = $(this).data().action;

        $.post(
            API_PATH, {
                'action': action
            },
            handleCommandResponse
        );

        $(this).blur(); //fixes persisting focus after a click
    });

    function handleCommandResponse(data) {
        console.log(data);
    }

    function routeSocketMessage(message) {
        console.log('Received STATUS message', message);
        if (message.status === 'volume') {
            updateVolumeLevel(message.value);
        } else {
            updatePlaybackStatus(message);
        }
    }

    function updateConnectionStatus(status) {
        var disconnectMessage = 'Disconnected from server. Attempting to reconnect.';
        var reconnectMessage = 'Reconnected to the server.';
        var statusElement = $('#status');
        var classSuffix = (status === 'disconnect') ? 'danger' : 'success';

        statusElement.attr('class', 'alert alert-' + classSuffix);

        if (status === 'disconnect') {
            timer.stop();
            statusElement.html(disconnectMessage);
            statusElement.fadeIn();
        } else if (status === 'reconnect') {
            statusElement.html(reconnectMessage);
            socket.emit('updateStatus');
            setTimeout(function() {
                statusElement.fadeOut();
            }, 4000);
        }
    }

    function updatePlaybackStatus(message) {
        var status = message.status;

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