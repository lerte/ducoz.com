import { createHmac } from 'crypto'

function percentEncode(str) {
  let result = encodeURIComponent(str)
  result = result.replace(/\+/g, '%20')
  result = result.replace(/\*/g, '%2A')
  result = result.replace(/\%7E/g, '~')
  return result
}

export default function computeSignature(parameters, accessKeySecret) {
  const sortedParameters = Object.keys(parameters).sort()
  let canonicalizedQueryString = ''
  for (let i = 0; i < sortedParameters.length; i++) {
    const key = sortedParameters[i]
    canonicalizedQueryString +=
      '&' + percentEncode(key) + '=' + percentEncode(parameters[key])
  }
  canonicalizedQueryString = canonicalizedQueryString.slice(1)
  const stringToSign = 'GET&%2F&' + percentEncode(canonicalizedQueryString)
  const signature = createHmac('sha1', accessKeySecret + '&')
    .update(stringToSign)
    .digest('base64')
  return signature
}
