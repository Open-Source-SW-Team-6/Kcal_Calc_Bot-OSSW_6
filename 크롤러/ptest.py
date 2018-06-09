from bs4 import BeautifulSoup
import urllib.request
import pymysql
#서버 설정 
conn = pymysql.connect(
    user = 'sjuackr18',
    passwd = 'sejonguniv2018',
    host ='stdbid.cjmpatqmujx2.us-east-2.rds.amazonaws.com',
    db ='ossw_6_kcal',
    charset ='utf8')
# mysql 연결 후 커서 추출하기 
cur = conn.cursor()

foodname=[]
kalinfor=[]
foodsg=[]

page=1
for page in range(1,678,1):#시작페이지와 끝페이지
    print('%d 페이지 시작',page)
    req = urllib.request.Request("http://47kg.kr/contents/caldic/update_list.php?&page="+ str(page), headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    text = response.read()

   
    soup = BeautifulSoup(text, 'html.parser')

    menu = soup.find_all('a')
    kal = soup.find_all('td')
    ##리스트 menu와 price에 쓰레기값 제거
    for n in menu:
        i = menu.index(n)
        menu[i]= n.get_text()

    foodlist=""
    #음식이름
    for i in range(30,44):
        foodlist += menu[i] + "\n"
        
        foodname.append(menu[i])
    #print(foodlist)
    
    for n in kal:
        i = kal.index(n)
        kal[i]=n.get_text()
        
    foodlist2=""

    #칼로리정보
    for i in range(29,97,5):
        foodlist2 += kal[i] + "\n"
        kalinfor.append(kal[i])
    #print(foodlist2)
    
    foodlist3=""
    #단위정보
    for i in range(30,98,5):
        foodlist3 += kal[i] + "\n"
        foodsg.append(kal[i])
    #print(foodlist3)
        
    #FOOD DB내의 음식명이 PRIMARY KEY이기에 발생하는 에러를 예외처리함
    res=0

       
    try:
        for i in range(0,14):
            cur.execute("INSERT INTO FOOD(menu,kcal,cafeteria,amount,unit) VALUES (%s,%s,%s,%s,%s)",(foodname[i],kalinfor[i],'기타',foodsg[i],foodsg[i]))
    except pymysql.IntegrityError:
        res = 1    
    except IntegrityError as e:
        if not e[0] == 1062:
            raise
        else:
            print(e, datetime.datetime.now())
            traceback.print_exc()
            res = 3
    #변경사항 커밋
    conn.commit()

    
    foodname=[]
    kalinfor=[]
    foodsg=[]
    


