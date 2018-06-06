var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var DBMS = require('./database');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/keyboard', function(req, res) {
    var data = {
        'type': 'text'
    };

    res.json(data);
});

app.post('/message', function(req, res) {
    var msg = req.body.content;
    console.log('전달받은 메시지: '+msg);
    var Send={};

    console.log(req.body.user_key);

    DBMS.addUserInfoCK(req.body.user_key, "Sain", 24, 1, 168.3, 59.7, "1.4", 60.0, 2123.4, "21", 0);
    //DBMS.DBdisConnect();

    switch(msg) {
        case '학생회관':
            Send={
                'message': {
                    'text': '학생회관을 선택했습니다!'
                },
                keyboard: {
                    'type': 'buttons',
                    'buttons': ['소금구이덮밥', '새우튀김알밥']
                }
            }
            break;

        case '군자관':
            Send={
                'message': {
                    'text': '군자관을 선택했습니다!'
                }
            }
            break;

        case '우정당':
            Send={
                'message': {
                    'text': '우정당을 선택했습니다!'
                }
            }
            break;

        default:
        Send={
            'message': {
                'text': '잘못된 명령입니다...\n 다음 키워드 중 하나를 선택해 주세요: "학생회관", "군자관, "우정당"'
            }
        }
        break;
    }

    res.json(Send);
});

http.createServer(app).listen(3030, function() {
    console.log('서버가 실행 중입니다.');
    DBMS.DBConnect();
});