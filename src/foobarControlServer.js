var net = require('net');
var config = require('../config.js');
var client;
var controlNumbers = {
    status : {
        'playing' : 111,
        'stopped' : 112,
        'paused' : 113,
        'volume' : 222,
        'info' : 999,
    },
    getStatus : function(code){
        for (var status in this.status){
            if (this.status[status] === code){
                return status;
            }
        }
    }
};

function parseControlData(text){
    var lines;
    var messageData = {};
    var statusFields = config.controlServerStatusFields;
    var statusNumber;
    var trackInfo;

    /*
    About the data parsed in this method:

    Initial message upon connection looks like this:

    Message 1:
    999|Connected to foobar2000 Control Server v1.0.1|
    999|Accepted client from 127.0.0.1|
    999|There are currently 2/10 clients connected|
    999|Type '?' or 'help' for command information|

    Message 2 (and subsequent playback status messages):
    113|3|282|2.73|FLAC|605|Imaginary Friends|Bronchitis|2013|Post-rock|?|Bronchitis (entire)|745|

    If music is not playing when user connects, messages 1 and 2 will be merged.
    */

    lines = text.split('\r\n');

    //handle message type 1
    if(lines.length === 4) return;

    //handle message type 1 + 2 combo
    if(lines.length === 6){
        trackInfo = lines.pop(4).split(config.CONTROL_SERVER_MESSAGE_SEPARATOR);
    }
    
    //handle message type 2
    trackInfo = trackInfo || lines[0].split(config.CONTROL_SERVER_MESSAGE_SEPARATOR);
    statusNumber = parseInt(trackInfo[0]);

    if(statusNumber ===  controlNumbers.status.volume){
        return {
            status : 'volume',
            value : trackInfo[1]
        };
    }
    
    var status = controlNumbers.getStatus(statusNumber);
    messageData[statusFields[0]] = status;

    for(var i=1;i<statusFields.length;i++){
        if (statusFields[i]){
            messageData[statusFields[i]] = trackInfo[i];
        }
    }

    return messageData;
}

function startConnection(socket){
    client = net.connect(
        { port: config.CONTROL_SERVER_PORT },
        function(){
            console.log('Web client connected', socket.id);
            socket.emit('info', 'Foobar web server connection established.');
        }
    );

    client.on('data', function(data){
        var message = parseControlData(data.toString('utf-8'));
        if(message.status){
            socket.emit('foobarStatus', message);
        }
        if(message.info){
            socket.emit('info', message.info);
        }
    });

    client.on('end', function() {
        socket.emit('info', 'Connection to Foobar control server ended.');
    });

    socket.on('disconnect', function(){
        console.log('Web client disconnected', socket.id);
        client.end();
    });

    socket.on('updateStatus', function(){
        console.log('updateStatus command received from client');
        client.write('trackinfo' + '\r\n');
    });
}

exports.sendCommand = function(command){
    if (command.indexOf('vol') !== -1){
        command = 'vol ' + command.substring(3);
    }else if(command === 'mute'){
        command = 'vol ' + 'mute';
    }
    console.log('Control server command sent for action', command);
    client.write(command + '\r\n');
};

exports.initialize = function(server){
    var io = require('socket.io').listen(server, {
        'log level' : 2
    });
    io.sockets.on('connection', startConnection);
};