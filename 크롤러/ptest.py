import requests
from bs4 import BeautifulSoup

url = 'http://datalab.naver.com/keyword/realtimeList.naver'

r = requests.get(url)
html_code = r.text
print(r)
soup = BeautifulSoup(html_code, 'html.parser')

rank_inner = soup.find('div', {'class': 'rank_inner v2'})

for rank, span in enumerate(rank_inner.findAll('span', {'class': 'title'})):
    print ("%d위" % (rank+1)), span.text
