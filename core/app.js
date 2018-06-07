var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var DBMS = require('./database');
var sendData = require('./send');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/keyboard', function(req, res) {
    var data = {
        'type': 'text'
    };
    console.log(res.user_key);
    res.json(data);
});

var userKey = null;
var isUserExist = false;
var inUserReg = false;
var userDefInfo = false;
var userActiveIX = null;
var userEODTIME = null;
var userName = null;
var userAge = 0;
var userGender = 0;
var userHeight = 0.0;
var userWeight = 0.0;

function DefInfoCheck(message) {
    var data = message.split(' ');
    userAge = parseInt(data[0]);
    userGender = parseInt(data[1]);
    userHeight = parseFloat(data[2]);
    userWeight = parseFloat(data[3]);

    if(userAge+'' == 'NaN') {
        console.log("나이가 잘못 되었습니다.");
        return false;
    }
    if(userGender+'' == 'NaN') {
        console.log("성별이 잘못 되었습니다.");
        return false;
    }
    if(userHeight+'' == 'NaN') {
        console.log("신장이 잘못 되었습니다.");
        return false;
    }
    if(userWeight+'' == 'NaN') {
        console.log("체중이 잘못 되었습니다.");
        return false;
    }

    if(userAge < 9) {
        userAge = 9
    } else if(userAge < 0 || userAge > 200) {
        console.log("나이 범위 초과입니다.")
        return false;
    }

    if(userGender < 1 || userGender > 2) {
        console.log("성별 범위 초과입니다.");
        return false;
    }

    if(userHeight < 30 || userHeight > 300) {
        console.log("신장 범위 초과입니다.");
        return false;
    }

    if(userWeight < 2 || userHeight > 300) {
        console.log("체중 범위 초과입니다.");
        return false;
    }

    console.log("age: "+userAge+", gen: "+userGender+", h: "+userHeight+", w: "+userWeight);
    return true;
}

function UserActIXCheck(message) {
    return false;
}

app.post('/message', function(req, res) {
    var msg = req.body.content + "";
    console.log('전달받은 메시지: '+msg);
    userKey = req.body.user_key;
    isUserExist = DBMS.checkUser(userKey);

    if(msg.match('등록') == '등록' && inUserReg == false) {
        if(!DBMS.checkUser(userKey)) {
            res.json(sendData.sendMsg('먼저 본인의 신체정보를 "나이 성별(남: 1 또는 여: 2) 신장 체중" 띄어쓰기 구분하여 순서대로 입력해주세요.\n(예: 24 1 170 72)', 0));
            console.log('유저가 없습니다.');
            inUserReg = true; //사용자가 없는 경우 사용자 등록중으로 플래그 설정
        } else {
            res.json(sendData.sendMsg("이미 있는 사용자 입니다. 변경할 수 있습니다.", 0));
            console.log('유저가 존재합니다.');
        }
    }
    else if(inUserReg == true) { //사용자 등록중인 경우
        console.log("사용자 등록 시작~");
        if(!userDefInfo) { //기본 정보가 없을 때
            console.log("기본 정보를 등록 중...");
            if(!DefInfoCheck(msg)){ //기본 정보를 제대로 입력했는지 검사
                res.json(sendData.sendMsg("잘못된 정보를 입력하셨습니다.. 다시 한 번 확인해 주세요~~", 0));
                console.log("잘못된 기본 정보 입력");
            }
            else {
                userDefInfo = true; //옳은 값이면 기본 정보 입력 완료로 플래그 설정
                console.log("기본 정보 입력 완료!");
                res.json(sendData.sendMsg("본인의 활동지수를 다음 번호로 입력해주세요.\n\n"
                +"1. 좌업 생활: 하루 걷는 시간 30분 이하\n\n"
                +"2. 낮은 활동: 하루 30~40분 걷기, 10~15분 조깅\n\n"
                +"3. 보통 활동: 하루 90~120분 걷기, 40~50분 조깅\n\n"
                +"4. 높은 활동: 하루 240분 이상 걷기, 60~90분 조깅", 0));
                console.log("신체 활동 지수 등록 중...");
            }
        }
        else if(userActiveIX == null) { //활동 지수가 입력이 되지 않았을 때
            if(!UserActIXCheck(msg)) {
                res.json(sendData.sendMsg("잘못된 정보를 입력하셨습니다.. 다시 한 번 확인해 주세요~~", 0));
                console.log("잘못된 활동 지수 입력");
            }
        }


        //console.log('등록 완료.');
        //inUserReg = false;

    } else {
        res.json(sendData.sendMsg("알 수 없는 명령입니다..ㅜㅜ", 0));
    }
});

http.createServer(app).listen(3000, function() {
    console.log('서버가 실행 중입니다.');
    DBMS.DBConnect();
});