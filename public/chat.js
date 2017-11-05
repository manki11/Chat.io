"use strict";
$(function () {
    var socket = io.connect();

    // for login and username
    var $userFormArea= $("#userFormArea");
    var $userForm= $("#userForm");
    var $users= $("#users");
    var $username= $("#username");

    //user form submission
    $userForm.submit(function (e) {
        e.preventDefault();
        console.log($username.val());
        socket.emit('new user', $username.val(), function (data) {
            if(data) {
                $userFormArea.hide();
                $messageArea.show();
            }
        });
    });

    // for messages section
    var $messageArea= $("#messageArea");
    var $messageForm= $("#messageForm");
    var $message= $("#message");
    var $chat= $("#chat");


    //message form submission
    $messageForm.submit(function (e) {
        e.preventDefault();
        console.log($message.val());
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<div class="well"><strong>'+data.author.username+'</strong>: '+ data.message +'</div>');
    });

    socket.on('get previous messages', function (allChats) {
       for(var i=0;i< allChats.length;i++){
           $chat.append('<div class="well"><strong>'+allChats[i].author.username+'</strong>: '+ allChats[i].message +'</div>');
       } 
    });

    socket.on('get users', function (data) {
        var html="";

        for(var i=0;i<data.length;i++){
            html += "<li class='list-group-item'>"+data[i].username+"</li>";
        }

        $users.html(html);
    });
});