import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import dayjs from 'dayjs'
import crypto from 'crypto'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let responseBody = ''
        res.on('data', (chunk) => {
          responseBody += chunk
        })
        res.on('end', () => {
          resolve(responseBody)
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

const router = express.Router()
const { ACCESS_KEY_ID, ACCESS_KEY_SECRET } = process.env

router.get('/:action', async (req, res) => {
  const params = {
    Format: 'JSON',
    Action: req.params.action,
    AccessKeyId: ACCESS_KEY_ID,
    RegionId: 'ap-southeast-1',
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: dayjs().toISOString(),
    SignatureNonce: uuidv4(),
    SignatureVersion: '1.0',
    Version: '2017-06-22',
    ...req.query
  }
  // 将参数按字典序排序
  const sortedParams = {}
  Object.keys(params)
    .sort()
    .forEach((key) => {
      sortedParams[key] = params[key]
    })
  // 将参数格式化为字符串
  const paramString = new URLSearchParams(sortedParams).toString()

  //计算签名
  const stringToSign = 'GET&%2F&' + encodeURIComponent(paramString)
  const Signature = crypto
    .createHmac('sha1', ACCESS_KEY_SECRET + '&')
    .update(stringToSign)
    .digest('base64')

  params['Signature'] = Signature

  let url = 'http://dm.ap-southeast-1.aliyuncs.com?'
  for (let param in params) {
    url += param + '=' + params[param] + '&'
  }
  const response = await get(url)
  return res.end(response)
})

export default router
