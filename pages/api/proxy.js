export default async function handler(req, res) {
  const SITE_SECRET = process.env.SITE_SECRET || ''
  if (!SITE_SECRET) {
    return res.status(500).json({ status: 'error', result: 'SITE_SECRET not set' })
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://vortix-world-bypass.vercel.app')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-hcaptcha-token')
    return res.status(200).end()
  }
  const url = req.method === 'POST' ? req.body?.url : req.query?.url
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ status: 'error', result: 'Missing url' })
  }
  try {
    const target = 'https://site-dusky-chi.vercel.app/bypass?url=' + encodeURIComponent(url)
    const forwardHeaders = {
      'x-site-token': SITE_SECRET,
      Origin: 'https://vortix-world-bypass.vercel.app',
      Referer: 'https://vortix-world-bypass.vercel.app'
    }
    const incomingH = req.headers['x-hcaptcha-token'] || req.headers['x-hcaptcha-token'.toLowerCase()]
    if (incomingH) forwardHeaders['x-hcaptcha-token'] = incomingH
    const resp = await fetch(target, {
      method: 'GET',
      headers: forwardHeaders,
      redirect: 'follow'
    })
    const data = await resp.json().catch(() => null)
    if (!data) {
      return res.status(502).json({ status: 'error', result: 'Invalid response from upstream' })
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(resp.status).json(data)
  } catch (e) {
    return res.status(502).json({ status: 'error', result: 'Upstream request failed' })
  }
}
