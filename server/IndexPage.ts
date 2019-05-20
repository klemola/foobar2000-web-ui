import { Request, Response } from 'express'

import { Context } from './Models'

const iconList = {
    playpause: 'play',
    stop: 'stop',
    prev: 'step-backward',
    next: 'step-forward',
    rand: 'random',
    mute: 'volume-off',
    voldown: 'volume-down',
    volup: 'volume-up'
}

export function renderIndex(ctx: Context) {
    return (reg: Request, res: Response) =>
        res.render('index', {
            title: ctx.config.appTitle,
            playbackActions: ctx.config.playbackActions,
            volumeActions: ctx.config.volumeActions,
            icons: iconList,
            serverConfig: {
                serverAddress: ctx.config.serverExternalIP,
                port: ctx.config.webServerPort
            }
        })
}
