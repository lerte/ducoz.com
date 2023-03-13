// const express = require('express')
// const router = express.Router()
// const HmacSha1 = require('crypto-js/hmac-sha1')
// const Base64 = require('crypto-js/enc-base64')
// const Moment = require('moment')
// const Uuid = require('uuid')
// const Urlencode = require('urlencode')

import request from 'request'
import express from 'express'
import HmacSha1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'
import Moment from 'Moment'
import { v4 as uuidv4 } from 'uuid'
import Urlencode from 'urlencode'

const router = express.Router()

// AccessKeyId
const accessKeyId = 'LTAI5t6NJu93sUN5EFKjZjr3'
//AccessKeySecret
const accesskeysecret = 'idkaOlyYfeoELhJlY0sPlBbJzSbqWM' + '&'

router.get('/descAccountSummary', async (req, res) => {
  //获取timestamp
  const timeStamp = Moment(new Date().get).utcOffset(0).format()
  //获取signatureNorce
  const signatureNorce = uuidv4()
  var params = {
    Action: 'DescAccountSummary',
    Format: 'JSON',
    RegionId: 'ap-southeast-1',
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: timeStamp,
    SignatureNonce: signatureNorce,
    SignatureVersion: '1.0',
    Version: '2017-06-22',
    AccessKeyId: accessKeyId
  }
  //对各个参数进行字典序升序排序
  function sortObjectKeys(obj) {
    var tmp = {}
    Object.keys(obj)
      .sort()
      .forEach(function (k) {
        tmp[k] = obj[k]
      })
    return tmp
  }
  params = sortObjectKeys(params)
  //对排序之后的参数进行urlEncode
  for (var i in params) {
    params[i] = Urlencode(params[i])
  }
  //对urlencode之后的特殊字符进行替换
  for (var k in params) {
    if (params[i].indexOf('+')) {
      params[i].replace('+', '%20')
    } else if (params[i].indexOf('*')) {
      params[i].replace('*', '%2A')
    } else if (params[i].indexOf('%7E')) {
      params[i].replace('%7E', '~')
    }
  }

  //拼接strToSign
  var strToSign = ''
  for (var ii in params) {
    strToSign += ii + '=' + params[ii] + '&'
  }
  strToSign = strToSign.substr(0, strToSign.length - 1)
  strToSign = 'GET&' + Urlencode('/') + '&' + Urlencode(strToSign)
  //计算签名
  params['Signature'] = Base64.stringify(HmacSha1(strToSign, accesskeysecret))

  var url = 'http://dm.ap-southeast-1.aliyuncs.com?'
  for (var param in params) {
    url += param + '=' + params[param] + '&'
  }

  const requestUrl = url.substr(0, url.length - 1)

  request(requestUrl, (error, response, body) => {
    return res.end(body)
  })
})

export default router
