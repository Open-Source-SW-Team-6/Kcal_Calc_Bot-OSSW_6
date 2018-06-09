var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var DBMS = require('./database');
var sendData = require('./send');
var getCurrentDate = require('./find-date');
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

var inFoodReg = false;
var userKey_Food = false;
var selectedCafeteria = null;
var selectedMenu = null;
var selectedKcal = 0.0;
var selectedAmount = 0.0;
var inpAmount = 0.0;
var selectedUnit = null;

function varsInit_food() { //음식 등록 변수 초기화
    inFoodReg = false;
    userKey_Food = false;
    selectedCafeteria = null;
    selectedMenu = null;
    selectedKcal = 0.0;
    selectedAmount = 0.0;
    inpAmount = 0.0;
    selectedUnit = null;
    console.log('재사용할 수 있도록 음식 등록 변수가 초기화 되었습니다.');
}

function varsInit() { //변수 초기화
    userKey = null;
    isUserExist = false;
    inUserReg = false;
    userDefInfo = false;
    userActiveIX = null;
    userEODTIME = null;
    userName = null;
    userAge = 0;
    userGender = 0;
    userHeight = 0.0;
    userWeight = 0.0;
    console.log('재사용할 수 있도록 변수가 초기화 되었습니다.');
}

function DefInfoCheck(message) { //기본 신체 정보 입력상태 체크
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
        userAge = 9;
    } else if(userAge < 0 || userAge > 200) {
        console.log("나이 범위 초과입니다.");
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

function UserActIXCheck(message, A, G) { //활동 지수 번호 입력상태 체크
    var tmp = parseInt(message);
    console.log(tmp+'');
    if(A == 0 || G == 0) {
        console.log('나이와 성별이 정의되지 않았습니다.');
        return false;
    }

    if(tmp+'' == 'NaN') {
        console.log('잘못된 활동지수 값을 입력했습니다.');
        return false;
    }
    if(tmp < 1 || tmp > 4) {
        console.log('활동지수는 1~4까지의 번호만 입력이 가능합니다.');
        return false;
    }

    if((A >= 0 && A < 19) && G == 1) { //소년
        console.log('소년입니다.');
        if(tmp == 1) {
            userActiveIX = 1.00;
        }
        else if(tmp == 2) {
            userActiveIX = 1.13;
        }
        else if(tmp == 3) {
            userActiveIX = 1.26;
        }
        else if(tmp == 4) {
            userActiveIX = 1.42;
        }
        return true;
    }
    else if((A >= 0 && A < 19) && G == 2) { //소녀
        console.log('소녀입니다.');
        if(tmp == 1) {
            userActiveIX = 1.00;
        }
        else if(tmp == 2) {
            userActiveIX = 1.16;
        }
        else if(tmp == 3) {
            userActiveIX = 1.31;
        }
        else if(tmp == 4) {
            userActiveIX = 1.56;
        }
        return true;
    }
    else if(A >= 19 && G == 1) { //남성
        console.log('남성입니다.');
        if(tmp == 1) {
            userActiveIX = 1.00;
        }
        else if(tmp == 2) {
            userActiveIX = 1.11;
        }
        else if(tmp == 3) {
            userActiveIX = 1.25;
        }
        else if(tmp == 4) {
            userActiveIX = 1.48;
        }
        return true;
    }
    else if(A >= 19 && G == 2) { //여성
        console.log('여성입니다.');
        if(tmp == 1) {
            userActiveIX = 1.00;
        }
        else if(tmp == 2) {
            userActiveIX = 1.12;
        }
        else if(tmp == 3) {
            userActiveIX = 1.27;
        }
        else if(tmp == 4) {
            userActiveIX = 1.45;
        }
        return true;
    }
    return false;
}

function AmountCheck(message) { //하루 종료 시간 입력상태 체크
    var tmp = parseFloat(message);
    if(tmp+'' == 'NaN') {
        console.log('잘못된 양 값을 입력했습니다.');
        return false;
    }
    else {
        inpAmount = tmp;
        return true;
    }
    return false;
}

function UserEODTCheck(message) { //하루 종료 시간 입력상태 체크
    var tmp = parseInt(message);
    if(tmp+'' == 'NaN') {
        console.log('잘못된 하루 종료시간 값을 입력했습니다.');
        return false;
    }
    if(tmp < 0 || tmp > 23) {
        console.log('시간 입력 범위가 잘못됐습니다.');
        return false;
    }
    else {
        userEODTIME = tmp;
        return true;
    }
    return false;
}

function UserNameCheck(message) { //닉네임 입력상태 체크
    if(message != null) {
        if(message+'' == '.')
            userName = '';
        else
            userName = message+'';
        return true;
    }
    return false;
}

app.get('/keyboard', function(req, res) {
    var data = {
        'type': 'buttons',
        'buttons': ['식사', '운동', '사용자등록']
    };
    res.json(data);
});

app.post('/message', function(req, res) {
    var msg = req.body.content + '';
    console.log('전달받은 메시지: '+msg);
    //isUserExist = DBMS.checkUser(req.body.user_key);

    if(msg.match('등록') == '등록' && !inUserReg && !inFoodReg) {
        if(!DBMS.checkUser(req.body.user_key)) {
            res.json(sendData.sendMsg('먼저 본인의 신체정보를 "나이 성별(남: 1 또는 여: 2) 신장 체중" 띄어쓰기 구분하여 순서대로 입력해주세요.\n(예: 24 1 170 72)', 0));
            console.log('유저가 없습니다.');
            inUserReg = true; //사용자가 없는 경우 사용자 등록중으로 플래그 설정
            console.log("사용자 등록 시작~");
            userKey = req.body.user_key;
        } else {
            res.json(sendData.sendMsg('이미 있는 사용자 입니다. 변경할 수 있습니다.', 0));
            console.log('유저가 존재합니다.');
        }
    }
    else if(userKey == req.body.user_key && inUserReg) { //다른 사용자가 등록중인 경우 현재 사용자 접근 막기
        //사용자 등록중인 경우
        if(msg.match('취소') == '취소') { //등록 중 취소 처리
            res.json(sendData.sendMsg('등록 취소 처리되었어요!', 0));
            console.log('사용자가 등록을 취소함');
            varsInit();
        }
        else if(!userDefInfo) { //기본 정보가 없을 때
            console.log('기본 정보를 등록 중...');
            if(!DefInfoCheck(msg)){ //기본 정보를 제대로 입력했는지 검사
                res.json(sendData.sendMsg('잘못된 정보를 입력하셨습니다.. 다시 한 번 확인해 주세요~~', 0));
                console.log('잘못된 기본 정보 입력');
            }
            else {
                userDefInfo = true; //옳은 값이면 기본 정보 입력 완료로 플래그 설정
                console.log('기본 정보 입력 완료!');
                res.json(sendData.sendMsg('본인의 활동지수를 다음 번호로 입력해주세요.\n\n'
                +'1. 좌업 생활: 하루 걷는 시간 30분 이하\n\n'
                +'2. 낮은 활동: 하루 30~40분 걷기, 10~15분 조깅\n\n'
                +'3. 보통 활동: 하루 90~120분 걷기, 40~50분 조깅\n\n'
                +'4. 높은 활동: 하루 240분 이상 걷기, 60~90분 조깅', 0));
                console.log('신체 활동 지수 등록 중...');
            }
        }
        else if(userActiveIX == null) { //활동 지수가 입력이 되지 않았을 때
            if(!UserActIXCheck(msg, userAge, userGender)) {
                res.json(sendData.sendMsg('활동지수는 1부터 4까지의 번호만 입력이 가능합니다~', 0));
                console.log('잘못된 활동 지수 입력');
            }
            else {
                console.log('활동 지수 입력 완료!: '+userActiveIX);
                res.json(sendData.sendMsg('하루를 마무리하는 시간을 0부터 23까지 숫자로 알려주세요!\n시간이 되면 하루동안 누적 및 소모 칼로리, 필요한 운동 정보등을 알 수 있습니다.', 0));
                console.log('신체 활동 지수 등록 중...');
            }
        }
        else if(userEODTIME == null) { //하루 종료 시간이 입력되지 않았을 때
            if(!UserEODTCheck(msg)) {
                res.json(sendData.sendMsg('시간은 0부터 23까지 가능합니다~', 0));
                console.log('잘못된 시간 입력');
            }
            else {
                console.log('하루 종료 시간 입력 완료!: '+userEODTIME);
                res.json(sendData.sendMsg('본인의 닉네임을 알려주세요! 원치 않는 경우 점(.) 하나만 입력해주세요! ㅎㅎ', 0));
                console.log('하루 종료 시간 등록 중...');
            }
        }
        else if(userName == null) { //닉네임이 입력되지 않았을 때
            if(!UserNameCheck(msg)) {
                res.json(sendData.sendMsg('잘못된 닉네임 입니다.', 0));
                console.log('잘못된 닉네임 입력');
            }
            else {
                var userSWeight = 50;
                var userRecKcal = 2000;
                console.log('닉네임 입력 완료!: '+userName);
                //여기서 표준체중 및 일일권장칼로리 계산해서 전역변수에 저장
                res.json(sendData.sendMsg((userName==''?'':userName+'님의 ') 
                + '정보가 등록되었습니다! 표준 체중은 '+userSWeight
                +'kg 이고, 일일권장칼로리는 '+userRecKcal+'kcal 입니다.', 0));
                console.log('모든 등록이 완료되었고 여기에 등록 정보가 출력됩니다.');
                //데이터베이스에 사용자 등록
                //DBMS.addUserInfo(req.body.userKey, userName, userAge, userGender, userHeight, userWeight, userActiveIX, userSWeight, userRecKcal, userEODTIME, currentDate);
                inUserReg = false; //사용자 등록을 마친걸로 플래그 설정
                varsInit(); //다른 사용자가 등록할 수 있게 변수들 Release
            }
        } 
    }
    else if(userKey != req.body.user_key && msg.match('등록') == '등록') {
       res.json(sendData.sendMsg('다른 사용자가 등록 중입니다...잠시만 기다려주세요. ㅜㅜ', 0));
    } 
    //여기에 사용자 등록을 제외한 기타 명령 입력
    else if((msg.match('식사') == '식사' || msg.match('음식') == '음식') && !inFoodReg) { //사용자가 먹은 음식을 등록하는 명령
        console.log('먹은 음식을 등록합니다.');
        inFoodReg = true; //음식을 등록 중인 플래그
        userKey_Food = req.body.user_key;
        var btn = ['학생회관', '군자관', '우정당', '기타', '취소']
        res.json(sendData.sendMsg('교내식당 또는 기타 음식을 선택 해 주세요.', 1, btn));
    }
    else if(userKey_Food == req.body.user_key && inFoodReg) { //다른 사용자 막기
        if(msg.match('취소') == '취소') { //사용자가 취소한 경우
            res.json(sendData.sendMsg('음식 등록을 취소했습니다.', 0));
            console.log('사용자가 음식 등록을 취소함.');
            varsInit_food(); //변수 초기화
        }
        else if(msg == '직접입력') {
            res.json(sendData.sendMsg('직접 입력해주세요~', 0));
        }
        else if(selectedCafeteria == null) {
            if(msg == '학생회관') { //학생회관 버튼을 클릭한 경우
                //각 버튼에 대해 데이터베이스에서 결과값들을 변수에 저장하고 버튼에 할당
                selectedCafeteria = msg;
                var btn = DBMS.selectWhereCaf(selectedCafeteria, 0);
                res.json(sendData.sendMsg('학생회관을 선택하셨습니다. 아래 메뉴 중 하나를 골라주세요!', 1, btn));
            }
            else if(msg == '군자관') { //군자관 버튼을 클릭한 경우
                selectedCafeteria = msg;
                var btn = DBMS.selectWhereCaf(selectedCafeteria, 0);
                res.json(sendData.sendMsg('군자관 선택하셨습니다. 아래 메뉴 중 하나를 골라주세요!', 1, btn));
            }
            else if(msg == '우정당') { //우정당 버튼을 클릭한 경우
                selectedCafeteria = msg;
                var btn = DBMS.selectWhereCaf(selectedCafeteria, 0);
                res.json(sendData.sendMsg('우정당을 선택하셨습니다. 아래 메뉴 중 하나를 골라주세요!', 1, btn));
            }
            else if(msg == '기타') { //기타 버튼을 클릭한 경우
                selectedCafeteria = msg;
                var btn = DBMS.selectWhereCaf(selectedCafeteria, 0);
                res.json(sendData.sendMsg('기타 음식을 선택하셨습니다. 아래 메뉴 중 하나를 골라주세요!', 1, btn));
            }
        }
        else if(selectedMenu == null) { //사용자가 입력한 메뉴 받기
            if(msg == '다시검색') {
                res.json(sendData.sendMsg('다시 검색합니다.', 0));
                console.log('다시 검색합니다.');
            }
            else if(!DBMS.checkFood(msg, selectedCafeteria)) {
                var str = DBMS.simlFood(msg, selectedCafeteria);
                var btnarr = DBMS.simlFoodBtn();
                if(str == '키워드가 없습니다...\n다른 걸로 검색해보세요~')
                    res.json(sendData.sendMsg(str, 0));
                else
                    res.json(sendData.sendMsg(str, 1, btnarr));
            }
            else {
                var result = DBMS.selectFood(msg, selectedCafeteria);
                selectedMenu = result[0].menu;
                selectedKcal = result[0].kcal;
                selectedAmount = result[0].amount;
                selectedUnit = result[0].unit;
                res.json(sendData.sendMsg(selectedMenu+"은(는) "+selectedUnit+"에 "+selectedKcal+"kcal 입니다.\n얼마나 드셨는지 숫자로 알려주세요!", 0));
            }
        }
        else if(inpAmount == 0.0) {
            if(!AmountCheck(msg)) {
                res.json(sendData.sendMsg('숫자만 입력이 가능합니다.', 0));
            }
            else {
                res.json(sendData.sendMsg('데이터베이스에 등록됩니다!', 0));
                console.log('데이터베이스에 등록이 완료됩니다.');
                varsInit_food();
            }
        }
    }
    else if(userKey_Food != req.body.user_key && (msg.match('식사') == '식사' || msg.match('음식') == '음식')) {
        res.json(sendData.sendMsg('다른 사용자가 등록 중입니다...잠시만 기다려주세요. ㅜㅜ', 0));
    }
    else {
        res.json(sendData.sendMsg('기본 메시지', 0));
    }
        /*
        res.json(sendData.sendMsg('알 수 없는 명령입니다..ㅜㅜ', 0));

        //반복문을 이용해 데이터베이스에서 모든 음식 가져와서 배열에 저장
        var 학생회관_menu = ['', '', '', ''];
        var 학생회관_kcal = ['', '', '', ''];
        var 학생회관_amount = ['', '', '', ''];
        var 학생회관_unit = ['', '', '', ''];

        var 군자관_menu = ['', '', '', ''];
        var 군자관_kcal = ['', '', '', ''];
        var 군자관_amount = ['', '', '', ''];
        var 군자관_unit = ['', '', '', ''];


        var 학관메뉴 = ['', '', '', ''];
        var Send = {
            'type':'buttons',
            'buttons':학관메뉴
        }
        //마찬가지로 군자관, 우정당, 기타음식에 대한 코드 작성*/
});

http.createServer(app).listen(3000, function() {
    console.log('서버가 실행 중입니다.');
    DBMS.DBConnect();
    console.log(getCurrentDate.myDateTime());
});