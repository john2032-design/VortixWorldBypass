import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import ResultBox from '../components/ResultBox'
import { EXAMPLE_URLS, isAllowedUrlString, copyText } from '../lib/api'

const API_PROXY = '/api/proxy?url='

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderText, setPlaceholderText] = useState(EXAMPLE_URLS[0])
  const [animKey, setAnimKey] = useState(0)
  const widgetRef = useRef(null)
  const widgetIdRef = useRef(null)
  const tokenRef = useRef('')

  useEffect(() => {
    const iv = setInterval(() => {
      setPlaceholderIndex(i => {
        const n = (i + 1) % EXAMPLE_URLS.length
        setPlaceholderText(EXAMPLE_URLS[n])
        setAnimKey(k => k + 1)
        return n
      })
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ''
    if (!sitekey) return
    const load = () => {
      if (window.hcaptcha && widgetRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.hcaptcha.render(widgetRef.current, {
          sitekey,
          size: 'normal',
          callback: (token) => { tokenRef.current = token },
          'expired-callback': () => { tokenRef.current = '' },
          'error-callback': () => { tokenRef.current = '' }
        })
      }
    }
    if (!window.hcaptcha) {
      const s = document.createElement('script')
      s.src = 'https://hcaptcha.com/1/api.js?render=explicit'
      s.async = true
      s.defer = true
      s.onload = load
      document.head.appendChild(s)
    } else {
      load()
    }
  }, [])

  async function doBypassRequest(urlToBypass) {
    setErrorMsg('')
    setApiData(null)
    try {
      const headers = { 'Accept': 'application/json' }
      const token = tokenRef.current || ''
      if (token) headers['x-hcaptcha-token'] = token
      const res = await fetch(API_PROXY + encodeURIComponent(urlToBypass), {
        method: 'GET',
        headers,
        credentials: 'include'
      })
      const json = await res.json().catch(() => null)
      if (!json) {
        setErrorMsg('Invalid response from API.')
        return
      }
      setApiData(json)
    } catch (err) {
      setErrorMsg('Network error or API unreachable.')
    } finally {
      tokenRef.current = ''
      if (widgetIdRef.current && window.hcaptcha) {
        try { window.hcaptcha.reset(widgetIdRef.current) } catch {}
      }
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    setCopied(false)
    setApiData(null)
    setErrorMsg('')
    const trimmed = (input || '').trim()
    if (!trimmed) {
      setErrorMsg('Please paste a url to bypass.')
      return
    }
    if (!isAllowedUrlString(trimmed)) {
      setErrorMsg('This site supports only listed domains. Use a supported shortlink.')
      return
    }
    setLoading(true)
    try {
      const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ''
      if (sitekey && widgetIdRef.current && window.hcaptcha) {
        if (!tokenRef.current) {
          try { window.hcaptcha.execute(widgetIdRef.current) } catch {}
          const tok = await new Promise((resolve) => {
            let waited = 0
            const poll = () => {
              const t = tokenRef.current
              if (t) return resolve(t)
              waited += 150
              if (waited > 20000) return resolve('')
              setTimeout(poll, 150)
            }
            poll()
          })
          if (!tok) {
            setErrorMsg('Please complete the captcha')
            setLoading(false)
            return
          }
        }
      }
      await doBypassRequest(trimmed)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!apiData) return
    const ok = await copyText(String(apiData.result ?? ''))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } else {
      setErrorMsg('Copy failed. Try manual copy.')
    }
  }

  function openResult() {
    if (!apiData) return
    const r = String(apiData.result ?? '')
    if (!r) return
    try {
      window.open(r, '_blank', 'noopener,noreferrer')
    } catch {
      window.location.href = r
    }
  }

  return (
    <main className="page">
      <div style={{position:'absolute', left:12, top:12, zIndex:2}} ref={widgetRef}></div>
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Paste a supported link to bypass</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-wrap">
              <input
                aria-label="URL to bypass"
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder=""
                disabled={loading}
                inputMode="url"
              />
              <div key={animKey} className="placeholder-fake">{placeholderText}</div>
            </div>
            <div className="controls">
              <button type="submit" className="btn" disabled={loading}>
                {loading ? <span className="spinner" aria-hidden="true"></span> : 'Bypass'}
              </button>
            </div>
          </form>
          {errorMsg && <div className="error">{errorMsg}</div>}
          {apiData && <ResultBox apiData={apiData} onCopy={handleCopy} copied={copied} onOpen={openResult} />}
          <div className="foot">
            <small>Made with ❤️ · VortixWorld</small>
          </div>
        </div>
      </section>
      <footer className="footer"></footer>
    </main>
  )
}
