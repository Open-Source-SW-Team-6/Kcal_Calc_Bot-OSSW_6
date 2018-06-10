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
		
		//한달에 31일인 월들
		if( (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 ||
		currentMonth == 8 || currentMonth == 10 || currentMonth == 12) && currentDay == 31) {
			//한달에 31일이 끝인 월의 31일째 되는 날이였을때, 월을 증가시키고 1일로 교체
			currentDay = 1;
			
			//12월이였으면, 년도 1 증가시키고 월을 1월로 교체, 아니면 그냥 월만 증가
			if(currentMonth == 12) {
				currentYear++;
				currentMonth = 1;
			} else {
				currentMonth++;
			}
		}
		else if( (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 ||
		currentMonth == 11) && currentDay == 30) {
			//한달에 30일이 끝인 월의 30일째 되는 날이였을때, 월을 증가시키고 1일로 교체
			currentDay = 1;
			currentMonth++;
		}
		else if( currentMonth == 2 && currentDay == 28 ) {
			//2월 28일이였는데, 그 해가 윤년일때 29일로 만듦, 아니면 월 바꾸고 1일로 교체
			if( ((currentYear % 4) == 0 && (currentYear % 100) != 0) || ((currentYear % 400) == 0)) {
				currentDay++;
			}
			else {
				currentDay = 1;
				currentMonth++;
			}
		}
		else if( currentMonth == 2 && currentDay == 29) {
			//2월 29일이였을때, 월 바꾸고 1일로 교체
			currentDay = 1;
			currentMonth++;
		}
		else {
			currentDay++;
		}
		
		currentDate = currentYear + "-" + currentMonth + "-" + (currentDay);
	}
	
	console.log("이제부터 기록될 날짜 : " +currentDate);
}




