/* 
변수를 하나 받아서(예: 22),
현재 시간이 변수(예: 22시 정각)만큼 되면
현재 날짜(2018-06-10)에 1일 더해서 2018-06-11이 출력이 되는 함수
*/

exports.checkTime = function() {
	var dt = new Date();
	var currentYear = dt.getFullYear();
	var currentMonth = (dt.getMonth()+1);
	var currentDay = dt.getDate();
	var end_of_time = 10;
	
	if(currentMonth < 10) {
		currentMonth = "0" + currentMonth;
	}
	
	var currentDate = currentYear + "-" + currentMonth + "-" + currentDay;
	
	console.log("오늘 날짜 : " + currentDate);
	
	if(dt.getHours() >= end_of_time) {
		console.log('오늘 하루의 마무리 시간이 다 되었네요.');
		currentDate = currentYear + "-" + currentMonth + "-" + (currentDay+1);
	}
	
	console.log("이제부터 기록될 날짜 : " +currentDate);
}