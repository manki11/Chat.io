"use strict";
$(function () {
    var socket = io.connect();

    // for login and username
    var $userFormArea= $("#userFormArea");
    var $userForm= $("#userForm");
    var $users= $("#users");
    var $username= $("#username");

    // for messages section
    var $messageArea= $("#messageArea");
    var $messageForm= $("#messageForm");
    var $message= $("#message");
    var $chat= $("#chat");

    //user form submission
    $userForm.submit(function (e) {
        e.preventDefault();
        console.log($username.val());
        socket.emit('new user', $username.val(), function (data) {
            if(data){
                $userFormArea.hide();
                $messageArea.show();
            }
        });
    });

    //message form submission
    $messageForm.submit(function (e) {
        e.preventDefault();
        console.log($message.val());
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<div class="well">'+ data.msg +'</div>');
    });

    socket.on('get users', function (data) {
        var html="";

        for(var i=0;i<data.length;i++){
            html += "<li class='list-group-item'>"+data[i]+"</li>"
        }

        $users.html(html);
    });
});