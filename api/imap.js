import express from 'express'
import { ImapEmails } from 'imap-emails'

const router = express.Router()

router.get('/verifyAccount', async (req, res) => {
  const { username, password, host } = req.query
  const imapEmails = new ImapEmails({
    username,
    password,
    imapConfig: {
      host,
      port: 993,
      tls: true,
      tlsOptions: {
        servername: host
      }
    }
  })
  try {
    await imapEmails.connect()
    return res.json({
      verify: true
    })
  } catch {
    return res.json({
      verify: false
    })
  } finally {
    await imapEmails.disconnect()
  }
})

router.get('/getEmails', async (req, res) => {
  const { username, password, host } = req.query
  const imapEmails = new ImapEmails({
    username,
    password,
    imapConfig: {
      host,
      port: 993,
      tls: true,
      tlsOptions: {
        servername: host
      }
    }
  })
  try {
    await imapEmails.connect()
    const emails = await imapEmails.getEmails({
      since: new Date('2023-01-01T00:00:00.000Z')
    })
    return res.json(emails)
  } catch {
    return res.json([])
  } finally {
    await imapEmails.disconnect()
  }
})

export default router
