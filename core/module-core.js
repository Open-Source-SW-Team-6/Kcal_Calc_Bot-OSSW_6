var syncMySQL = require('./database');

function stWeight(height, gender){ //표준 체중 구하는 함수
	return (height/100)*(height/100) * (gender==1 ? 22 : 21);
}

function dayKcal(age, gender, height, weight, activix){ //일일권장칼로리 구하는 함수
	var kcal = 0.0;

	if((age >= 0 && age < 19) && gender == 1) { //소년
		console.log('소년입니다.');
		kcal = 88.5 - 61.9 * age + activix * (26.7 * weight + 903 * (height/100)) + 25
    }
    else if((age >= 0 && age < 19) && gender == 2) { //소녀
		console.log('소녀입니다.');
		kcal = 135.3 - 30.8 * age + activix * (10.0 * weight + 934 * (height/100)) + 25
    }
    else if(age >= 19 && gender == 1) { //남성
		console.log('남성입니다.');
		kcal = 662 - 9.53 * age + activix * (15.91 * weight + 539.6 * (height/100))
    }
    else if(age >= 19 && gender == 2) { //여성
		console.log('여성입니다.');
		kcal = 345 - 6.91 * age + activix * (9.361 * weight + 726 * (height/100))
	}
	
	return kcal;
}

function getMyActivity(userKey, Tdate) {
	var wholeKcal = 0.0; //총 드신 칼로리
	var wkList = null; //섭취 칼로리 목록
	var consumKcal = 0.0; //소모한 칼로리
	var ckList = null; //소모 칼로리 목록
	var exptAcKcal = 0.0; //예상 누적 칼로리((총 드신 칼로리 - 소모한 칼로리)-일일칼로리)
	var txtMsg = "";
	var exrList = null;
	var exrMinuteKcal = 0.0;
	
	wkList = syncMySQL.syncConnection.query("SELECT actInfo FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=0 AND userKey='"+userKey+"'");
	ckList = syncMySQL.syncConnection.query("SELECT actInfo FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=1 AND userKey='"+userKey+"'");

	//console.log(wkList);
	//console.log(ckList);

	wholeKcal = syncMySQL.syncConnection.query("SELECT SUM(kcal) AS WK FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=0 AND userKey='"+userKey+"'")[0].WK;
	txtMsg += "총 드신 칼로리: "+wholeKcal+"kcal"
	for(var i=0; i < wkList.length; i++) {
		txtMsg += "\n  "+(i+1)+". "+wkList[i].actInfo;
	}

	consumKcal = syncMySQL.syncConnection.query("SELECT SUM(kcal) AS CK FROM USER_ACTIVITY WHERE recDate='"+Tdate+"' AND type=1 AND userKey='"+userKey+"'")[0].CK;
	txtMsg += "\n\n소모한 칼로리: "+consumKcal+"kcal"
	for(var i=0; i < ckList.length; i++) {
		txtMsg += "\n  "+(i+1)+". "+ckList[i].actInfo;
	}

	exptAcKcal = (wholeKcal - consumKcal) - syncMySQL.syncConnection.query("SELECT recomandation_kcal FROM USER WHERE userKey='"+userKey+"'")[0].recomandation_kcal;
	txtMsg += "\n\n예상 누적 칼로리: "+exptAcKcal+"kcal";
	
	if(exptAcKcal < 0) {
		txtMsg += "\n더 드셔도 됩니다~!";
	}
	else if( exptAcKcal >= 0 && exptAcKcal < 100) {
		txtMsg += "\n그만 드셔야 합니다!";
	}
	else if(exptAcKcal >= 100) {
		txtMsg += "\n앞으로 다음과 같은 운동을 하셔야 살이 찌지 않습니다!";
		txtMsg += checkExr(exrList, exptAcKcal);
	}
	
	/*예상 누적 칼로리가 음수이면 : txtMsg에 "더 드셔도 됩니다~",
				양수이고 100 미만까지 : txtMsg에 "그만 드세요!", ---일일 권장 칼로리의 99칼로리까지는 초과 허용 가능
					 그 이상 넘어간 경우 : txtMsg에 "앞으로 다음과 같은 운동을 하셔야 합니다."
					 --> 예) 1. 걷기 %분
								  2. 수영 %분 .....
					**<분 = 운동(분당소모량)/예상누적칼로리>
					

			*** 해야 할 운동 목록은 우선 전부 띄우는 것만 하고 여유 되면 전체 운동 목록 중에서 랜덤하게 5개 정도만 나오게 할 수 있으면 해줘~
	*/
	return txtMsg;
}

function checkExr(exrList, exptAcKcal) {
	exrList = syncMySQL.syncConnection.query("SELECT * FROM ACTIVITY");
	var i;
	var txtMsg = "";
	var random = 0;
	for(i=0; i<5; i++) {
		random = Math.floor((Math.random() * exrList.length));
		txtMsg += "\n" + (i+1) + ". " + exrList[random].act_type + " " + (exptAcKcal / exrList[random].kcal_per_min) + "분";
	}
	return txtMsg;
}

module.exports = {
	'stWeight':stWeight,
	'dayKcal':dayKcal,
	'getMyActivity':getMyActivity
}

