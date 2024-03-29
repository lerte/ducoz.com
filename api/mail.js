import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import dayjs from 'dayjs'
import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import computeSignature from './computeSignature.js'

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
  // 计算签名
  const Signature = computeSignature(params, ACCESS_KEY_SECRET)
  params['Signature'] = Signature

  let url = 'http://dm.ap-southeast-1.aliyuncs.com?'
  for (let param in params) {
    url += param + '=' + params[param] + '&'
  }
  const response = await get(url)
  return res.end(response)
})

export default router
