module.exports = function(app, express) {

    app.configure(function() {
        app.set('views', __dirname + '/templates');
        app.set('view engine', 'jade');
        app.set('view options', {
            pretty: true
        });

        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.compress());
        app.use(express.static(__dirname + '/static'));
        app.use(app.router);

        app.locals.pretty = true;
    });

    app.configure('development', function() {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    app.configure('production', function() {
        app.use(express.errorHandler());
    });

};
