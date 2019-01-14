var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
var socketio = require('socket.io');
var html = require('escape-html');
var server = http.Server(app);
var io = socketio(server);
var port = 3000;
server.listen(port, function() {
        console.log('Server running at port ' + port);
});
app.use(express.static(__dirname+'/project'));
app.get('/',function(req,res){
        res.sendFile('index.html');
});
var clients={};
clients['0']={name: "бот", color:'#FFFFFF'};
var phrase = require('./speechMap1.json');
var finalPhrase = require('./finalSpeech.json');
var commonPhrase = require('./commonPhrases.json');
var botReq = require('./officedocs.json');

function uniqId(a) {
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uniqId)
};
    

io.on('connection', function(socket){
    socket.on('setUserName',function(data) {
        socket.emit('message',{nickname: {name: "бот", color:'#FFFFFF'}, message:"Привет, "+data.name});
        socket.broadcast.emit('newUser','Пользователь ' + data.name +' присоединился');
        clients[socket.id]=data;
        io.sockets.emit('newList',clients);
    });

    socket.on('message', function(data) {
        if (data.file) {
           uniqname = uniqId();
           uniqname = 'work/' + uniqname + '.'+ data.ext;
           fs.writeFile ('project/' + uniqname, data.file, function (err) {
             if (err) throw err;
             console.log('Saved!' , uniqname); 
             socket.broadcast.emit('message', {nickname: data.nickname, message: data.message, rel: uniqname, ext: data.ext});
             });
         }   
         else {
            socket.broadcast.emit('message', {nickname: data.nickname, message: data.message})
         }
         if(data.message.toLowerCase().startsWith("бот,")){
                botReply(data);
           };
     });

    socket.on('bothelp', function(data) {
        var doc = ["timetable.pdf", "bells.pdf", "teachers.pdf", "marks.pdf", "changes.pdf"];
        botFile = 'bot/' + doc[data];
        socket.emit('message', {nickname: {name: 'бот', color: '#FFFFFF'}, message: 'Бот в помощь', rel: botFile, ext: 'pdf'});

    });

    socket.on('disconnect', function(){
        socket.broadcast.emit('newUser', 'Пользователь ' + clients[socket.id].name + ' вышел из чата');
        clients[socket.id] = '';
        io.sockets.emit('newList',clients);
    });

});

function botReply(info){
    var reply = '';
    var botFile = '';
    var newInfo = info.message.toLowerCase();
    var reg = new RegExp();
    for(var key in botReq){
        reg = RegExp(key);
        if(reg.test(newInfo)){
            botFile = 'bot/' + botReq[key];
        }
    }
    if(botFile){
        console.log(botFile);
        io.sockets.emit('message',{nickname: {name: 'бот', color: '#FFFFFF'}, rel: botFile, ext: 'pdf'});
    }
    else {
        for(var key in phrase){
            reg = RegExp(key);
            if(reg.test(newInfo)){
                var ph = phrase[key];
                var ph1 = finalPhrase[ph];
                var choiceReply = Math.floor(Math.random()*ph1.length);
                reply = ph1[choiceReply];
            }
       }
        if(reply=='') {
            if(info.message.endsWith('?')) var ph = commonPhrase['answers'];
            else var ph = commonPhrase['common'];
            var choiceReply = Math.floor(Math.random()*ph.length);
            reply = ph[choiceReply];
        }
        reply = info.nickname.name + ', ' + reply;

        io.sockets.emit('message',{nickname: {name: "бот", color:'#FFFFFF'}, message: reply});
    }
}