from bs4 import BeautifulSoup
import urllib.request

page=1
for page in range(1,3):
    req = urllib.request.Request("http://47kg.kr/contents/caldic/update_list.php?&page="+ str(page), headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    text = response.read()

   
    soup = BeautifulSoup(text, 'html.parser')

    menu = soup.find_all('a')
    kal = soup.find_all('td')
    #price = soup.find_all('div',{'class':'td price'})
    ##리스트 menu와 price에 쓰레기값 제거
    for n in menu:
        i = menu.index(n)
        menu[i]= n.get_text()

    foodlist=""

    for i in range(30,44):
        foodlist += menu[i] + "\n"

    print(foodlist)
#   for n in kal:

    for n in kal:
        i = kal.index(n)
        kal[i]=n.get_text()
        
    foodlist2=""
    #음식이름정보
    for i in range(28,96,5):
        foodlist2 += kal[i] + "\n" 
    print(foodlist2)
    foodlist2=""
    #칼로리정보
    for i in range(29,97,5):
        foodlist2 += kal[i] + "\n" 
    print(foodlist2)
    foodlist2=""
    #단위정보
    for i in range(30,98,5):
        foodlist2 += kal[i] + "\n" 
    print(foodlist2)    
