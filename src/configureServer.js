const express = require('express');
const bodyParser = require('body-parser')
const indexPage = require('./indexPage');

function configure(app) {
    app.use(bodyParser.json())
    app.use(express.static(__dirname + '/static'));

    app.set('views', __dirname + '/templates');
    app.set('view engine', 'jade');
    app.set('view options', {
        pretty: true
    });
    app.locals.pretty = true;

    app.get('/', indexPage);
};

exports.configure = configure;
