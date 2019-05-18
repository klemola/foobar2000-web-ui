/* eslint no-param-reassign: off */

const Http = require('http')
const Express = require('express')
const BodyParser = require('body-parser')
const SocketIo = require('socket.io')
const IndexPage = require('./IndexPage')
const Foobar = require('./Foobar')

function createErrorHandler(ctx, io) {
    return () =>
        io.sockets.emit(
            'controlServerError',
            'Connection to Foobar control server ended.'
        )
}

function createServer(app) {
    const server = Http.createServer(app)
    const io = SocketIo.listen(server, {
        'log level': 2
    })

    return {
        server,
        io
    }
}

function configureStatic(ctx, app) {
    app.use(BodyParser.json())
    app.use(Express.static(`${__dirname}/../ui`))

    app.set('views', `${__dirname}/templates`)
    app.set('view engine', 'jade')
    app.set('view options', {
        pretty: true
    })
    app.locals.pretty = true

    app.get('/', IndexPage.renderIndex(ctx))
}

function configureWebsockets(ctx, io) {
    const handleErr = createErrorHandler(ctx, io)

    io.sockets.on('connection', socket => {
        ctx.logger.info({ socketId: socket.id }, 'Web client connected')

        socket.on('disconnect', () => {
            ctx.logger.info({ socketId: socket.id }, 'Web client disconnected')
        })

        socket.on('foobarCommand', command =>
            Foobar.sendCommand(ctx, io, command)
        )

        Foobar.queryTrackInfo(ctx)
    })

    ctx.client.on('data', Foobar.onData(ctx, io))
    ctx.client.on('end', handleErr)
    ctx.client.on('error', handleErr)
}

exports.createServer = createServer
exports.configureStatic = configureStatic
exports.configureWebsockets = configureWebsockets
