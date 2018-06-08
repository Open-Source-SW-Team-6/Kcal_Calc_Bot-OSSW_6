/* 아래를 수행하고 제어판 -> 관리도구 -> 서비스 -> MYSQL 재시작 해주기 */ 
/* MySQL Workbench 상단 메뉴의 Edit - Preferences - 좌측 리스트의 SQL Editor -
Other 칸의 "Safe Updates". Forbid UPDATEs and DELETEs with no key in WHERE clause or no LIMIT clause. 
Requires a recommection 을 체크해제한다.*/ 

CREATE TABLE USER ( 
    userKey		varchar(30) not null PRIMARY KEY,
    username	char(16) not null,
    age			int not null,
    gender		int not null,
    height		double not null,
    weight		double not null,
    activity	double not null,
    sWeight	double not null,
    recomandation_kcal	double not null,
    day_of_endtime	int not null,
    regDate 	date not null
)
/* 한글 정상출력을 위한 코드 */
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE USER_ACTIVITY (
	userKey		char(30) not null,
    recDate		date not null,
    type		int not null,
    kcal		double not null,
    actInfo		char(48) not null
)
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE FOOD(
	menu char(20) not null PRIMARY KEY,
    kcal double not null,
    /* std : 학관, gunza : 군자, woojeong : 우정, outside : 외부 */ 
    cafeteria	char(10) not null,
    amount		double not null,
    unit		char(16) not null
)
DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE ACTIVITY (
	act_type		char(15) not null PRIMARY KEY,
    kcal_per_min	double not null
)
DEFAULT CHARACTER SET utf8mb4;

INSERT INTO ACTIVITY VALUES('걷기', 0.0666);
INSERT INTO ACTIVITY VALUES('계단오르내리기', 0.1166);
INSERT INTO ACTIVITY VALUES('등산', 0.1333);
INSERT INTO ACTIVITY VALUES('수영', 0.15);
INSERT INTO ACTIVITY VALUES('요가', 0.05);
INSERT INTO ACTIVITY VALUES('복싱', 0.1833);
INSERT INTO ACTIVITY VALUES('줄넘기', 0.1833);
INSERT INTO ACTIVITY VALUES('자전거타기', 0.1333);
INSERT INTO ACTIVITY VALUES('달리기', 0.1166);
INSERT INTO ACTIVITY VALUES('스쿼트', 0.1166);
INSERT INTO ACTIVITY VALUES('사이클', 0.1166);
INSERT INTO ACTIVITY VALUES('스쿼시', 0.2166);
INSERT INTO ACTIVITY VALUES('훌라후프', 0.0666);
INSERT INTO ACTIVITY VALUES('런닝머신', 0.1833);
INSERT INTO ACTIVITY VALUES('에어로빅', 0.1);
INSERT INTO ACTIVITY VALUES('윗몸일으키기', 0.1333);