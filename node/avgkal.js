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

module.exports = {
	'stWeight':stWeight,
	'dayKcal':dayKcal
}

