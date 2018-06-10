var mysql = require('mysql');
var syncMySQL = require('sync-mysql');

var connData = {
    host: 'stdbid.cjmpatqmujx2.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'sjuackr18',
    password: '',
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
	if(cafeteria == '기타') {
		for(var i=0; i < 98; i++) {
			menuArr[i+1] = result[i].menu;
		}
	}
	else {
		for(var i=0; i < 5; i++) {
			menuArr[i+1] = result[i].menu;
		}
	}
    return menuArr;
}
//소모한 칼로리를 구하는 함수
exports.checkActivity = function(act_type, minute) {
	var sql = "SELECT kcal_per_min FROM ACTIVITY WHERE act_type = '"+act_type+"'";
	
	const result = syncConnection.query(sql);
	console.log(result);
	
	return (minute * result[0].kcal_per_min);
}

//사용자 고유 키, 사용자 이름, 나이, 성별, 신장, 체중, 활동지수, 표준체중, 일일권장칼로리, 하루마무리시간, 등록날짜
exports.addUserInfo = function(uKey, uName, uAge, uGen, uHeight, uWeight, uActix, sWeight, recKcal, doEndTime, regDate) {
    var userNm = uName;
    if(uName == '.')
        userNm = null;
    var sql = "INSERT INTO USER SET ?";
    var post = {
        userKey: uKey,
        username: userNm,
        age: uAge,
        gender: uGen,
        height: uHeight,
        weight: uWeight,
        activity: uActix,
        avg_weight: sWeight,
        recomandation_kcal: recKcal,
        day_of_endtime: doEndTime
    };

    function callback(err, result) {
        if(err) {
            throw err;
        }
        console.log("Insert completed!");
    }

    connection.query(sql, post, callback);
}