import http from 'http'
import path from 'path'
import express from 'express'
import * as bodyparser from 'body-parser'
import socketio from 'socket.io'

import * as Foobar from './Foobar'
import { Context } from './Models'

function createErrorHandler(ctx: Context, io: socketio.Server) {
    return () =>
        io.sockets.emit(
            'controlServerError',
            'Connection to Foobar control server ended.'
        )
}

export function create() {
    const app = express()
    const server = http.createServer(app)
    const io = socketio(server)

    return {
        server,
        app,
        io
    }
}

export function configureStatic(ctx: Context, app: express.Application) {
    const staticDir = path.join(__dirname, 'static')

    app.use(bodyparser.json())
    app.use(express.static(staticDir))

    app.locals.pretty = true

    app.get('/', (req, res) => res.sendFile(path.join(staticDir, 'index.html')))
}

export function configureWebsockets(ctx: Context, io: socketio.Server) {
    const handleErr = createErrorHandler(ctx, io)

    io.sockets.on('connection', socket => {
        ctx.logger.info('Web client connected', { socketId: socket.id })

        socket.on('disconnect', () => {
            ctx.logger.info('Web client disconnected', { socketId: socket.id })
        })

        socket.on('foobarCommand', command =>
            Foobar.sendCommand(ctx, io, command)
        )

        // TODO: query current volume
        Foobar.queryTrackInfo(ctx, io)
    })

    ctx.client.on('data', Foobar.onData(ctx, io))
    ctx.client.on('end', handleErr)
    ctx.client.on('error', handleErr)
}
