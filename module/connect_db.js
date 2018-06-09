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

exports.menuInsert = function (){
	var hak_menu = ['', '', '', ''];
	var hak_kcal = ['', '', '', ''];
	var hak_amount = ['', '', '', ''];
	var hak_unit = ['', '', '', ''];
	
	var gunza_menu = ['', '', '', ''];
	var gunza_kcal = ['', '', '', ''];
	var gunza_amount = ['', '', '', ''];
	var gunza_unit = ['', '', '', ''];
	
	var woojeong_menu = ['', '', '', ''];
	var woojeong_kcal = ['', '', '', ''];
	var woojeong_amount = ['', '', '', ''];
	var woojeong_unit = ['', '', '', ''];

    var sql = "SELECT * FROM FOOD WHERE cafeteria = '학생회관';";
	var i;
    const result1 = syncConnection.query(sql);
	
	for(i=0; i<result1.length; i++) {
		hak_menu[i] = result1[i].menu;
		hak_kcal[i] = result1[i].kcal;
		hak_amount[i] = result1[i].amount;
		hak_unit[i] = result1[i].unit;
	}
	
	sql = "SELECT * FROM FOOD WHERE cafeteria = '군자관';";
    const result2 = syncConnection.query(sql);
	
	for(i=0; i<result2.length; i++) {
		gunza_menu[i] = result2[i].menu;
		gunza_kcal[i] = result2[i].kcal;
		gunza_amount[i] = result2[i].amount;
		gunza_unit[i] = result2[i].unit;
	}
	
	sql = "SELECT * FROM FOOD WHERE cafeteria = '우정당';";
    const result3 = syncConnection.query(sql);
	
	for(i=0; i<result3.length; i++) {
		woojeong_menu[i] = result3[i].menu;
		woojeong_kcal[i] = result3[i].kcal;
		woojeong_amount[i] = result3[i].amount;
		woojeong_unit[i] = result3[i].unit;
	}
	
	
	for(i = 0; i< 5; i++) {
		console.log(hak_menu[i],
		hak_kcal[i],
		hak_amount[i],
		hak_unit[i]
		);
	}
	for(i = 0; i< 5; i++) {
		console.log(gunza_menu[i],
		gunza_kcal[i],
		gunza_amount[i],
		gunza_unit[i]
		);
	}
	for(i = 0; i< 5; i++) {
		console.log(woojeong_menu[i],
		woojeong_kcal[i],
		woojeong_amount[i],
		woojeong_unit[i]
		);
	}
}