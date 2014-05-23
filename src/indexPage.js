var APP_TITLE = 'Foobar2000 Webui';
var config = require('../config');

//temporary
var iconList = {
    'playpause': 'play',
    'stop': 'stop',
    'prev': 'step-backward',
    'next': 'step-forward',
    'rand': 'random',
    'mute': 'volume-off',
    'voldown': 'volume-down',
    'volup': 'volume-up'
};

module.exports = function(req, res) {
    res.render('index', {
        title: APP_TITLE,
        playbackActions: config.playbackActions,
        volumeActions: config.volumeActions,
        icons: iconList,
        serverConfig: {
            'serverAddress': config.SERVER_EXTERNAL_IP,
            'port': config.WEB_SERVER_PORT
        }
    });
};
