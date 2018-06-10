/* 
변수를 하나 받아서(예: 22),
현재 시간이 변수(예: 22시 정각)만큼 되면
현재 날짜(2018-06-10)에 1일 더해서 2018-06-11이 출력이 되는 함수
*/

/*
1-31, 2-28, 3-31, 4-30, 5-31, 6-30, 7-31, 8-31, 9-30,  10 -31, 11-30, 12-31
*/

exports.checkTime = function() {
	var dt = new Date();
	var currentYear;
	var currentMonth;
	var currentDay;
	var end_of_time = 10;
	
	if(dt.getHours() >= end_of_time) {
		console.log('오늘 하루의 마무리 시간이 다 되었네요.');
		dt.setDate(dt.getDate() + 1);
		currentYear = dt.getFullYear();
		currentMonth = (dt.getMonth() + 1);
		currentDay = dt.getDate();
	}
	
	if(currentMonth < 10) {
		currentMonth = "0" + currentMonth;
	}
	
	if(currentDay < 10) {
		currentDay = "0" + currentDay;
	}
	
	currentDate = currentYear + "-" + currentMonth + "-" + currentDay;
	
	console.log("이제부터 기록될 날짜 : " +currentDate);
	
	return currentDate;
}




