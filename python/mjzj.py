import time
import json
import datetime
import requests

size = 20 #每页大小

def getYearDates(year):
  dates = []
  start = datetime.date(year, 1, 1)
  end = datetime.date(year, 12, 31)
  day = 0
  while True:
    current = start + datetime.timedelta(days=day)
    dates.append(current)
    day += 1
    if current == end:
      break
  return dates

def writeFile(fileName, jsonData):
  with open('./.cache/mjzj/'+fileName+'.json', 'w') as file:
    json.dump(jsonData, file)

def getList(startTime, endTime, position):
  print('正在爬取{}的数据,position:{}'.format(startTime, endTime))
  url = 'https://data.mjzj.com/api/Exposury/Search?type=ReviewerExposure&sortType=1size={}&postion={}&startTime={}&endTime={}'.format(position, size, startTime, endTime)
  with requests.Session() as session:
    session.get('https://mjzj.com/checkevaluate')
    response = session.get(url)
    jsonData = response.json()
    if response.status_code == 200:
      jsonLength = len(jsonData['list'])
      # 写入json文件
      if jsonLength>0:
        fileName = '{}-{}'.format(startTime, position)
        writeFile(fileName, jsonData)
      if jsonData['nextPosition']:
        _position = jsonData['nextPosition']
        if position != _position:
          getList(startTime, endTime, _position)
    if response.status_code == 429:
      # 休息5分钟
      print(jsonData['message'], startTime)
      time.sleep(60*5)
      getList(startTime, endTime, position)

for day in getYearDates(2017):
  startTime = day
  endTime = day + datetime.timedelta(days = 1)
  getList(startTime, endTime, 0)
