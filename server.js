"use strict";
var express= require("express"),
    mongoose= require("mongoose"),
    Chat= require("./models/chats"),
    User= require("./models/users");
var app= express();

var server= require('http').createServer(app);
var io= require("socket.io").listen(server);

var users = [];
var connections = [];

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/chat_app", {useMongoClient: true});

app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");

//chat route
app.get('/', function (req, res) {
    res.render('chat');
});

io.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {
        // if(!socket.username) return;
        User.update(
            {_id: socket._id},
            { $set: { online: false } }).exec(
            function (err, effect) {
            console.log("User offline :"+ socket.username);
            updateUserNames();
            connections.splice(connections.indexOf(socket),1 );
            console.log('Disconnected: %s sockets connected', connections.length);
        });
    });

    //Send Message
    socket.on('send message', function (data) {
        var message= data;

        var author={
            id:socket._id,
            username:socket.username
        };
        Chat.create({author: author, message: message}, function (err, chatMessage) {
            io.sockets.emit("new message", chatMessage);
        });
    });

    //new user
    socket.on('new user', function (data, callback) {
        User.find({username: data}, function (err, users) {
            if(err){
                console.log(err);
            }else if(users.length === 0){
                User.create({username: data, online: true}, function (err, user) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("User created :"+ user.username);
                        callback({success: 1});
                        socket.username= user.username;
                        socket._id= user._id;
                        updateUserNames();
                        sendPreviousChat();
                    }
                });
            }else if(!users[0].online) {
                User.update({_id: users[0]._id},{ $set:{online:true}}, function (err, user) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("User online :"+ users[0].username);
                        callback({success: 1});
                        socket.username= users[0].username;
                        socket._id= users[0]._id;
                        updateUserNames();
                        sendPreviousChat();
                    }
                });
            }else{
                console.log("User couldn't be created");
                callback({success: 0});
            }
        });
    });
    
    function updateUserNames() {
        User.find(function (err, allUsers) {
            if(err){
                console.log(err);
            }else{
                io.sockets.emit('get users', allUsers);
            }
        });
    }

    function sendPreviousChat() {
        Chat.find(function (err, allChats) {
            if(err){
                console.log(err);
            }else{
                io.sockets.emit('get previous messages', allChats);
            }
        });
    }
});

server.listen(3000, function () {
    console.log("server listening on port 3000");
});