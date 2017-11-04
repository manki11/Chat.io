"use strict";
var express= require("express");
var app= express();

var server= require('http').createServer(app);
var io= require("socket.io").listen(server);

var users = [];
var connections = [];

server.listen(3000, function () {
    console.log("server listening on port 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});