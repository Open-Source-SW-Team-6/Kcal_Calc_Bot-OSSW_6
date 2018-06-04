/* 아래를 수행하고 제어판 -> 관리도구 -> 서비스 -> MYSQL 재시작 해주기 */ 
/* MySQL Workbench 상단 메뉴의 Edit - Preferences - 좌측 리스트의 SQL Editor -
Other 칸의 "Safe Updates". Forbid UPDATEs and DELETEs with no key in WHERE clause or no LIMIT clause. 
Requires a recommection 을 체크해제한다.*/ 

CREATE TABLE USER ( 
	uid 		int not null,
    userKey		varchar(30) not null PRIMARY KEY,
    username	char(10) not null,
    age			int not null,
    gender		char(5) not null,
    height		double not null,
    weight		double not null,
    activity	char(20) not null,
    avg_weight	double not null,
    recomandation_kcal	double not null,
    day_of_endtime	char(10) not null
)
/* 한글 정상출력을 위한 코드 */
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE USER_ACTIVITY (
	userKey			varchar(30) not null PRIMARY KEY,
    username		char(10) not null,
    gain_kcal		double not null,
	health_kcal		double not null,
    day_kcal		double not null,
    remain_kcal		double not null,
    weight_month	double not null
)
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE FOOD(
	menu char(20) not null PRIMARY KEY,
    kcal double not null,
    /* std : 학관, gunza : 군자, woojeong : 우정, outside : 외부 */ 
    cafeteria	char(10) not null
)
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE ACTIVITY (
	act_type		char(15) not null PRIMARY KEY,
    kcal_per_hour	double not null
)
DEFAULT CHARACTER SET utf8mb4;