var socket = io({transports: ['websocket']});
var params = location.search.substring(1).split('?');
function generateColor() {
    color = '#';
    for (var i = 1; i < 4; i++) {
        color +=  Math.floor(Math.random()*127 + 128).toString(16);
    }
  return color;
}
var n = '';
for(var i=0;i<params.length;i++){
    n+=params[i];
};
n=decodeURIComponent(n);
var nickname = {name:n, color:generateColor()};
document.getElementById("nick").innerHTML = nickname.name.substr(0,1);
document.getElementById('nick').style.backgroundColor = nickname.color;
socket.emit('setUserName', nickname);   

function sendMessage(n, mess, atFile) {
       if (mess || atFile) {
            renderTime('myTime');
            if(mess) {
                var info = document.createElement('div');
                info.className = 'mine';
                info.innerHTML = mess;  
                main.appendChild(info); 
            };
            if (document.getElementById('preview')) {
               mType = atFile.name.substring(atFile.name.lastIndexOf('.')+1, atFile.name.length);
               mType = mType.toLowerCase();
               var preimg = document.createElement('img');
               preimg.className = 'previewImage';
               preimg.style.marginLeft = '53%';
               preimg.src = document.getElementById('preview').children[1].src;
               main.appendChild(preimg);
               clearFile();
               socket.emit('message', {nickname:n, message:mess, file:atFile, ext:mType});
             }
             else {
                socket.emit('message',{nickname: n, message: mess});
             };      
            main.scrollTop = main.scrollHeight; 
        };    
        document.forms[0].reset();
        document.getElementById("mymessage").focus();
 };

 function openNW(d) {
    window.open(d,"Image","width=400,height=400");
 }

    socket.on('message', function(data) {
         renderTime('otherTime');
         var info = document.createElement('div');
         info.className = 'others';
         var ava = document.createElement('div');
         ava.className = 'avatar';
         ava.innerHTML = (data.nickname.name == 'бот')? 'бот' : data.nickname.name.substr(0,1);
         ava.style.backgroundColor =  data.nickname.color;
         main.appendChild(ava);
         if(data.message) {
             info.innerHTML = data.message;
             main.appendChild(info); 
         }; 
         if (data.rel) {
            mType=data.ext; 
            var preimg = document.createElement('img'); 
           // preimg.onclick = openNW(data.url);
            if (imageType.includes(mType)) {   
               preimg.src = data.rel; 
               title = 'Загрузка изображения';
               //alert(data.rel);
               preimg.className = 'atImage';
            }
            else if(mType in mimeType) {
               preimg.src = mimeType[mType];
               title = 'Загрузка документа';
               preimg.className = 'previewImage';
           }
            else {
                preimg.src = 'pict/other.png';
                title = 'Загрузка файла';
                preimg.className = 'previewImage';
            }
            main.appendChild(preimg);
            preimg.onclick = function() {
                w = window.open(data.rel,'');
                w.onload = function() {
                w.document.title = title;
            }
            }
         }
         main.scrollTop = main.scrollHeight;
    });

    socket.on('newUser', function(data){
        var info = document.createElement('div');
        info.className = 'incoming';
        info.innerHTML = data;
        main.appendChild(info);
    });

    socket.on('newList', function(data){
        document.getElementById('users').innerHTML = '';
        for(var key in data){
            if(data[key] != ''){
               var ava = document.createElement('span');
               ava.className = 'avatar';
               ava.innerHTML = (data[key].name == 'бот')? 'бот' : data[key].name.substr(0,1);
               ava.style.backgroundColor =  data[key].color;
               ava.style.marginTop='-5px';
               users.appendChild(ava);
               var p = document.createElement('p');
               p.innerHTML = data[key].name;
               users.appendChild(p);
            }; 
        };  
    });

function renderTime(param){
    var time = document.createElement('p');
    time.className = param;
    var mDate = new Date();
    time.innerHTML = '<strong>' + mDate.getHours() + ':' + mDate.getMinutes() + '</strong>' + '  ';
    time.innerHTML += mDate.getDate() + '.' + (mDate.getMonth() + 1) + '.' + mDate.getFullYear();
    main.appendChild(time);
}

function clearFile() {
    document.getElementById('dopDiv').style.height = 0;
    document.getElementsByClassName('panel')[0].style.bottom = 0;
    document.getElementById('main').style.height = '83vh';
    document.getElementById('dopDiv').removeChild(document.getElementById('preview'));

}

var mimeType = {
    'docx':'pict/word.png',
    'doc':'pict/word.png',
    'pdf':'pict/pdf.png',
    'txt':'pict/text.png',
    'xlsx':'pict/excel.png',
    'xltx':'pict/excel.png',
    'xls':'pict/excel.png',
    'exe':'pict/exe.png'};
var imageType = ['gif','jpeg','jpg','png','svg'];

document.getElementById('myFile').onchange = function(){
    var input = this.files[0];
    mType = input.name.substring(input.name.lastIndexOf('.')+1, input.name.length);
    mType = mType.toLowerCase();
    var reader = new FileReader();
    reader.onload = function(event) {
        var dataUri = event.target.result;
        document.getElementsByClassName('panel')[0].style.bottom = '60px';
        document.getElementById('dopDiv').style.height = '60px';
        document.getElementById('main').style.height = '73vh';
        var prev = document.createElement('div');
        prev.id = 'preview';
        document.getElementById('dopDiv').appendChild(prev);
        var close = document.createElement('img');
        close.className = 'fileclose';
        close.src = 'pict/close.png';
        document.getElementById('preview').appendChild(close);
        var preimg = document.createElement('img');
        preimg.className = 'previewImage';
        if (imageType.includes(mType)) {   
            preimg.src = dataUri;   
        }
        else if(mType in mimeType) {
            preimg.src = mimeType[mType];
        }
            else {
                preimg.src = 'pict/other.png';
            }
        document.getElementById('preview').appendChild(preimg);
        document.getElementsByClassName('fileclose')[0].onclick = clearFile;
    }
        reader.readAsDataURL(input);
}

function botHelpO() {
    var bh = document.getElementsByClassName('botHelp')[0];
    //bh.toggle('height');
    bh.style.height = '40vh';
    bh.style.transition = '0.8s ease-in-out';
    var vbm = document.getElementsByClassName('vert-bot-menu')[0];
    vbm.style.display = 'block';
}
function botHelpD() {
    var bh = document.getElementsByClassName('botHelp')[0];
    //bh.toggle('height');
    bh.style.height = '10vh';
    bh.style.transition = '0.8s ease-in-out';
    var vbm = document.getElementsByClassName('vert-bot-menu')[0];
    vbm.style.display = 'none';
}
function botHelp(n) {
    socket.emit('bothelp',n);
}