exports.currentDate = function() {
	var today = new Date();

	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = yyyy+'-'+mm+'-'+dd;

	return today;
}

exports.checkTime = function(end_of_time, UTC) {
	var dt = new Date();
	var currentYear;
	var currentMonth;
	var currentDay;

	var tz = dt.getTime() + (dt.getTimezoneOffset() * 60000) + (UTC * 3600000);
	dt.setTime(tz);

	if(dt.getHours() >= end_of_time) {
		console.log('오늘 하루의 마무리 시간이 다 되었네요.');
		dt.setDate(dt.getDate() + 1);
		currentYear = dt.getFullYear();
		currentMonth = (dt.getMonth() + 1);
		currentDay = dt.getDate();
	}
	else {
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