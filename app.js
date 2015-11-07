var express = require('express');
var peer = require('peer').ExpressPeerServer;
var matcher = require('./server/matcher.js')

var app = express();
app.use(express.static('public'));
app.use('/ready', matcher.handler);

var server = app.listen(8080);
app.use('/peer', peer(server, {debug: true}));
