const config = require('../config');

const iconList = {
    'playpause': 'play',
    'stop': 'stop',
    'prev': 'step-backward',
    'next': 'step-forward',
    'rand': 'random',
    'mute': 'volume-off',
    'voldown': 'volume-down',
    'volup': 'volume-up'
};

function renderIndex(req, res) {
    res.render('index', {
        title: config.appTitle,
        playbackActions: config.playbackActions,
        volumeActions: config.volumeActions,
        icons: iconList,
        serverConfig: {
            'serverAddress': config.serverExternalIP,
            'port': config.webServerPort
        }
    });
};

exports.renderIndex = renderIndex;