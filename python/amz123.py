import re
import math
import json
import datetime
import requests

url = 'https://www.amz123.com/api/ugc/v1/user_content/forum_list'

def mapItem(item):
  # 提取标题和描述中的邮箱地址
  emails = re.findall(r"[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+", item['title'] + item['description'])
  # 用逗号分隔开
  email = ','.join(emails)
  return {
    'id': item['id'],
    'createdTime': datetime.datetime.fromtimestamp(item['published_at']).strftime("%Y-%m-%d %H:%M"),
    'summary': item['description'],
    'reviewerExposure': {
      'email': email,
      'name': item['title']
    }
  }

def writeFile(fileName, jsonData):
  with open('./cache/amz123/'+fileName+'.json', 'w') as file:
    json.dump(jsonData, file)


def getList():
  payload = {
    "page": 1,
    "fid": 6
  }
  while True:
    response = requests.post(url, json=payload)
    jsonData = response.json()
    rows = jsonData['data']['rows']
    content = {'list': list(map(mapItem, rows))}
    writeFile(str(payload['page']), content)
    total = jsonData['data']['total']
    totalPage = math.ceil(total/30)
    print('正在爬取第{}页的数据, 每页30条, 总共{}页'.format(payload['page'], totalPage))
    payload['page'] += 1
    if payload['page'] == totalPage+1:
      break

if __name__ == '__main__':
  getList()
