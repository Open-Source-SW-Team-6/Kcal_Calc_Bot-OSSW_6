var mysql = require('mysql');
var syncMySQL = require('sync-mysql');

var connData = {
    host: 'stdbid.cjmpatqmujx2.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'sjuackr18',
    password: 'sejonguniv2018',
    database: 'ossw_6_kcal'
}

var connection = mysql.createConnection(connData);
var syncConnection = null;

exports.DBConnect = function() {
    connection.connect();
    syncConnection = new syncMySQL(connData);
    console.log('데이터베이스에 연결됨');
}

exports.DBdisConnect = function() {
    connection.end();
    syncConnection.end();
    console.log('데이터베이스 해제됨');
}

exports.checkUser = function (uKey){

    var sql = "SELECT EXISTS (SELECT * FROM USER WHERE userKey='"+uKey+"') AS SUCCESS";

    const result = syncConnection.query(sql);
    console.log(result);
    
    return result[0].SUCCESS == 0 ? false : true;
}

exports.checkFood = function (message, caf){

    var sql = "SELECT COUNT(*) AS RES FROM FOOD WHERE menu='"+message+"' AND cafeteria='"+caf+"'";

    const result = syncConnection.query(sql);
    console.log(result);
    
    return result[0].RES == 0 ? false : true;
}

var btnArr = [];

exports.simlFood = function (message, caf){
    btnArr = [];

    var sql = "SELECT menu FROM FOOD WHERE menu LIKE '%"+message+"%' AND cafeteria='"+caf+"'";
    var strArr = '다음 키워드가 존재합니다!\n';

    const result = syncConnection.query(sql);
    console.log(result);

    btnArr[0] = '다시검색';

    for(var i = 0; i < result.length; i++) {
        strArr += '\n' + result[i].menu;
        if(i < 98)
            btnArr[i+1] = result[i].menu;
    }
    
    if(strArr == '다음 키워드가 존재합니다!\n')
        strArr = '키워드가 없습니다...\n다른 걸로 검색해보세요~';

    return strArr;
}

exports.simlFoodBtn = function() {
    return btnArr;
}

exports.selectFood = function (message, caf){

    var sql = "SELECT * FROM FOOD WHERE menu='"+message+"' AND cafeteria='"+caf+"'";

    const result = syncConnection.query(sql);
    console.log(result);
    
    return result;
}

exports.selectAct = function(message) {
	var sql = "SELECT * FROM ACTIVITY WHERE act_type='"+message+"'";
	
	const result = syncConnection.query(sql);
	console.log(result);
	
	return result;
}

exports.selectWhereCaf = function(cafeteria) {
    var sql = "SELECT * FROM FOOD WHERE cafeteria='"+cafeteria+"'";
    var menuArr = [];
    menuArr[0] = '직접입력';

    const result = syncConnection.query(sql);
    console.log(result);
	
    for(var i=0; i < result.length; i++) {
        if(i < 98)
        menuArr[i+1] = result[i].menu;
    }
        
    return menuArr;
}

exports.selectActivity = function() {
    var sql = "SELECT act_type FROM ACTIVITY"
    var result = syncConnection.query(sql);

    var arr = [];
    arr[0] = '직접입력';
    arr[1] = '취소';

    for(var i = 0; i < result.length; i++ ) {
        arr[i+2] = result[i].act_type;
    }

    return arr;
}

//소모한 칼로리를 구하는 함수
exports.checkActivity = function(act_type, minute, userKey) {
	var sql = "SELECT kcal_per_min FROM ACTIVITY WHERE act_type = '"+act_type+"'";
	
	const result = syncConnection.query(sql);
    console.log(result);
    
    usrWeight = syncConnection.query("SELECT weight FROM USER WHERE userKey='"+userKey+"'")[0].weight;
	
	return (minute * result[0].kcal_per_min * usrWeight);
}

exports.checkActListIn = function (message){

    var sql = "SELECT COUNT(*) AS LST FROM ACTIVITY WHERE act_type='"+message+"'";

    const result = syncConnection.query(sql);
    console.log(result);
    
    return result[0].RES == 0 ? false : true;
}

//사용자 고유 키, 사용자 이름, 나이, 성별, 신장, 체중, 활동지수, 표준체중, 일일권장칼로리, 하루마무리시간, 등록날짜
exports.addUserInfo = function(uKey, uName, uAge, uGen, uHeight, uWeight, uActix, uSWeight, recKcal, doEndTime, uRegDate) {
    var userNm = uName;
    if(uName == '.')
        userNm = '';
    var sql = "INSERT INTO USER SET ?";
    var post = {
        userKey: uKey,
        username: userNm,
        age: uAge,
        gender: uGen,
        height: uHeight,
        weight: uWeight,
        activity: uActix,
        sWeight: uSWeight,
        recomandation_kcal: recKcal,
        day_of_endtime: doEndTime,
        regDate: uRegDate
    };

    function callback(err, result) {
        if(err) {
            throw err;
        }
        console.log("Insert user completed!");
    }

    connection.query(sql, post, callback);
}

exports.addUserActivity = function(uKey, uRecDate, uType, uKcal, uAcName) {
    var sql = "INSERT INTO USER_ACTIVITY SET ?";
    var uAcumKcal = 0.0;

    var senKcal = 0.0;

    if(uType == 0)
        senKcal = uKcal;
    else if(uType == 1)
        senKcal = uKcal*-1;

    
    //하나도 없을 경우
    if(syncConnection.query("SELECT COUNT(*) AS CNT FROM USER_ACTIVITY WHERE userKey='"+uKey+"'")[0].CNT <= 0) {
        //축적 칼로리를 새롭게 세팅
        uAcumKcal = senKcal - syncConnection.query("SELECT recomandation_kcal FROM USER WHERE userKey='"+uKey+"'")[0].recomandation_kcal;
    }
    else {
        var tmp = syncConnection.query("SELECT accumKcal FROM USER_ACTIVITY WHERE userKey='"+uKey+"'");
        uAcumKcal = senKcal + (tmp[tmp.length-1].accumKcal);
    }

    var uActInf = uAcName+'('+senKcal.toFixed(2)+')';

    var post = {
        userKey: uKey,
        recDate: uRecDate,
        type: uType,
        kcal: uKcal,
        actInfo: uActInf,
        accumKcal: uAcumKcal
    };

    function callback(err, result) {
        if(err) {
            throw err;
        }
        console.log("Insert act. completed!");
    }

    connection.query(sql, post, callback);
}

exports.getMyActivity = function(userKey, Tdate) {
	var wholeKcal = 0.0; //총 드신 칼로리
	var wkList = null; //섭취 칼로리 목록
	var consumKcal = 0.0; //소모한 칼로리
	var ckList = null; //소모 칼로리 목록
	var exptAcKcal = 0.0; //예상 누적 칼로리((총 드신 칼로리 - 소모한 칼로리)-일일칼로리)
	var txtMsg = "";
	var exrList = null;
	var exrMinuteKcal = 0.0;
	
	wkList = syncConnection.query("SELECT actInfo FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=0 AND userKey='"+userKey+"'");
	ckList = syncConnection.query("SELECT actInfo FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=1 AND userKey='"+userKey+"'");

	console.log(wkList);
	console.log(ckList);

	wholeKcal = syncConnection.query("SELECT SUM(kcal) AS WK FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=0 AND userKey='"+userKey+"'")[0].WK;
	txtMsg += "총 드신 칼로리: "+wholeKcal.toFixed(2)+"kcal"
	for(var i=0; i < wkList.length; i++) {
		txtMsg += "\n  "+(i+1)+". "+wkList[i].actInfo;
	}

	consumKcal = syncConnection.query("SELECT SUM(kcal) AS CK FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=1 AND userKey='"+userKey+"'")[0].CK;
	txtMsg += "\n\n소모한 칼로리: "+consumKcal.toFixed(2)+"kcal"
	for(var i=0; i < ckList.length; i++) {
		txtMsg += "\n  "+(i+1)+". "+ckList[i].actInfo;
	}

	var tmp = syncConnection.query("SELECT accumKcal FROM USER_ACTIVITY WHERE userKey='"+userKey+"'");
	exptAcKcal = tmp[tmp.length-1].accumKcal + 0.0;
	txtMsg += "\n\n예상 누적 칼로리: "+exptAcKcal.toFixed(2)+"kcal";
	
	if(exptAcKcal < 0) {
		txtMsg += "\n\n\n더 드셔도 됩니다~!";
	}
	else if( exptAcKcal >= 0 && exptAcKcal < 100) {
		txtMsg += "\n\n\n그만 드셔야 합니다!";
	}
	else if(exptAcKcal >= 100) {
		txtMsg += "\n\n\n앞으로 다음과 같은 운동을 하셔야 살이 찌지 않습니다!";
		txtMsg += checkExr(exrList, exptAcKcal);
	}

	return txtMsg;
}

function checkExr(exrList, exptAcKcal) {
	exrList = syncConnection.query("SELECT * FROM ACTIVITY");
	var i;
	var txtMsg = "";
	var random = 0;
	for(i=0; i<5; i++) {
		random = Math.floor((Math.random() * exrList.length));
		txtMsg += "\n " + (i+1) + ". " + exrList[random].act_type + " " + (exptAcKcal / exrList[random].kcal_per_min) + "분";
	}
	return txtMsg;
}

exports.getUserEODTIME = function(userKey) {
    var tmp = syncConnection.query("SELECT day_of_endtime FROM USER WHERE userKey='"+userKey+"'");

    return tmp[0].day_of_endtime;
}