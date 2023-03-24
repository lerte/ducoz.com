import dotenv from 'dotenv'
dotenv.config()

import https from 'https'
import express from 'express'
import { createClient } from 'altogic'
import cookieParser from 'cookie-parser'
import mail from './mail'
import imap from './imap'

const app = express()
const { ENV_URL, CLIENT_KEY, WEB_HOOK_KEY } = process.env

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''
      res.on('data', (chunk) => {
        responseBody += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(responseBody))
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.write(JSON.stringify(data))
    req.end()
  })
}

const altogic = createClient(ENV_URL, CLIENT_KEY)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// 邮箱登录
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { errors, session, user } = await altogic.auth.signInWithEmail(
    email,
    password
  )
  if (errors) {
    return res.json({ errors })
  }
  altogic.auth.setSession(session)
  altogic.auth.setSessionCookie(session.token, req, res)
  delete user['checkmail']
  delete user['review']
  delete user['facebook_ad_account']
  return res.json({
    session,
    user
  })
})

// 手机号登录
app.post('/signin', async (req, res) => {
  const { phone, password } = req.body
  const { errors, session, user } = await altogic.auth.signInWithPhone(
    phone,
    password
  )
  if (errors) {
    return res.json({ errors })
  }
  altogic.auth.setSession(session)
  altogic.auth.setSessionCookie(session.token, req, res)
  return res.json({
    session,
    user
  })
})

// 账号注册
app.post('/register', async (req, res) => {
  const { email, password, ...rest } = req.body
  const { user, errors, session } = await altogic.auth.signUpWithEmail(
    email,
    password,
    rest
  )

  if (errors) {
    return res.json({ errors })
  }

  if (session) {
    altogic.auth.setSessionCookie(session.token, req, res)
    altogic.auth.setSession(session)
    return res.json({ user, session })
  }

  return res.json({ user })
})
app.get('/verify-user', async (req, res) => {
  const { access_token } = req.query

  const { errors, user, session } = await altogic.auth.getAuthGrant(
    access_token
  )

  if (errors) {
    return res.json({ errors })
  }

  altogic.auth.setSessionCookie(session.token, req, res)
  altogic.auth.setSession(session)
  return res.json({ user, session })
})
app.get('/logout', async (req, res) => {
  const { session_token } = req.cookies
  await altogic.auth.signOut(session_token)
  altogic.auth.removeSessionCookie(req, res)
  res.redirect('/login')
})

// 发送企业微信机器人消息
app.post('/sendMessage', async (req, res) => {
  const options = {
    hostname: 'qyapi.weixin.qq.com',
    path: `/cgi-bin/webhook/send?key=${WEB_HOOK_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  await doRequest(options, req.body)
  return res.json('Talk is cheap. Show me your code.')
})

// 邮件相关
app.use('/mail', mail)
app.use('/imap', imap)

export default app
