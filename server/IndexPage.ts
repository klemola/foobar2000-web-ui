import { Request, Response } from 'express'

import { Context, playbackActions, volumeActions } from './Models'

const iconList = {
    play: 'play',
    pause: 'pause',
    stop: 'stop',
    prev: 'step-backward',
    next: 'step-forward',
    rand: 'random',
    'vol mute': 'volume-off',
    'vol down': 'volume-down',
    'vol up': 'volume-up'
}

export function renderIndex(ctx: Context) {
    return (_: Request, res: Response) =>
        res.render('index', {
            title: ctx.config.appTitle,
            playbackActions,
            volumeActions,
            icons: iconList,
            serverConfig: {
                serverAddress: ctx.config.serverExternalIP,
                port: ctx.config.webServerPort
            }
        })
}
