const iconList = {
    playpause: 'play',
    stop: 'stop',
    prev: 'step-backward',
    next: 'step-forward',
    rand: 'random',
    mute: 'volume-off',
    voldown: 'volume-down',
    volup: 'volume-up',
};

function renderIndex(ctx) {
    return (reg, res) => res.render('index', {
        title: ctx.config.appTitle,
        playbackActions: ctx.config.playbackActions,
        volumeActions: ctx.config.volumeActions,
        icons: iconList,
        serverConfig: {
            serverAddress: ctx.serverExternalIP,
            port: ctx.webServerPort,
        },
    });
}

exports.renderIndex = renderIndex;
