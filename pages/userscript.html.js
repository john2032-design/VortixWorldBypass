import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'

const API_PROXY = '/api/proxy?url='
const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY
const LOGO_SRC = 'https://i.ibb.co/p6Qjk6gP/BFB1896-C-9-FA4-4429-881-A-38074322-DFCB.png'

export default function UserscriptPage() {
  const router = useRouter()
  const [status, setStatus] = useState('init')
  const [message, setMessage] = useState('Initializing...')
  const [error, setError] = useState('')
  const [needsCaptcha, setNeedsCaptcha] = useState(false)
  const [resultText, setResultText] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    const params = new URLSearchParams(window.location.search)
    const target = params.get('url')
    if (!target) {
      setStatus('error')
      setError('Missing url parameter')
      setMessage('Error')
      return
    }
    attemptResolve(target, '')
  }, [router.isReady])

  function loadHCaptcha() {
    if (window.hcaptcha) return
    const s = document.createElement('script')
    s.src = 'https://js.hcaptcha.com/1/api.js?render=explicit'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }

  function renderHCaptcha(target) {
    if (!window.hcaptcha) return
    const container = document.getElementById('hcaptcha-container')
    if (!container) return
    window.hcaptcha.render(container, {
      sitekey: HCAPTCHA_SITEKEY,
      theme: 'dark',
      callback: (token) => attemptResolve(target, token)
    })
  }

  function isValidUrl(str) {
    try {
      const u = new URL(String(str))
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch (e) {
      return false
    }
  }

  function isLuarmorUrl(str) {
    try {
      const u = new URL(String(str))
      const h = u.hostname.toLowerCase()
      return h === 'ads.luarmor.net' || h.endsWith('.ads.luarmor.net')
    } catch (e) {
      return String(str).includes('ads.luarmor.net')
    }
  }

  function copyToClipboard(text) {
    if (!text) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => fallbackCopy(text))
    } else {
      fallbackCopy(text)
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {}
    document.body.removeChild(ta)
  }

  function handleSuccessRedirect(url) {
    const resultUrl = String(url)
    const params = new URLSearchParams(window.location.search)
    const returnUrl = params.get('return')

    if (isLuarmorUrl(resultUrl) && returnUrl) {
      setMessage('Returning to userscript…')
      setStatus('success')
      setTimeout(() => {
        const sep = returnUrl.includes('?') ? '&' : '?'
        window.location.href = `${returnUrl}${sep}redirect=${encodeURIComponent(resultUrl)}`
      }, 800)
      return
    }

    setMessage('Redirecting…')
    setStatus('success')
    setTimeout(() => {
      window.location.href = resultUrl
    }, 1000)
  }

  function attemptResolve(target, token) {
    setStatus('loading')
    setMessage('Resolving link…')
    setError('')
    setResultText('')

    const headers = { Accept: 'application/json' }
    if (token) headers['x-hcaptcha-token'] = token

    fetch(API_PROXY + encodeURIComponent(target), {
      method: 'GET',
      headers,
      credentials: 'include'
    })
      .then(r => r.json().catch(() => null))
      .then(json => {
        if (!json) {
          setStatus('error')
          setError('Invalid response')
          setMessage('Error')
          return
        }
        if (json.status === 'success' && json.result) {
          if (isValidUrl(json.result)) {
            handleSuccessRedirect(json.result)
            return
          } else {
            setResultText(String(json.result))
            setStatus('result')
            setMessage('Bypass Complete!')
            return
          }
        }
        if (json.result && String(json.result).toLowerCase().includes('hcaptcha')) {
          setNeedsCaptcha(true)
          setStatus('captcha')
          setMessage('Complete captcha to continue')
          loadHCaptcha()
          setTimeout(() => renderHCaptcha(target), 300)
          return
        }
        if (json.result && isValidUrl(json.result)) {
          handleSuccessRedirect(json.result)
          return
        }
        if (json.result) {
          setResultText(String(json.result))
          setStatus('result')
          setMessage('Bypass Complete!')
          return
        }
        setStatus('error')
        setMessage('Error')
        setError(String(json.result || 'Unable to resolve'))
      })
      .catch(() => {
        setStatus('error')
        setMessage('Error')
        setError('Network error')
      })
  }

  return (
    <>
      <Head>
        <title>VortixWorld Bypass</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/BFB1896C-9FA4-4429-881A-38074322DFCB.png" />
      </Head>

      <main className="page">
        <section className="hero">
          <div className="card">
            <div className="userscript-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
              <img src={LOGO_SRC} alt="VortixWorld" className="vw-icon-img" style={{ width: '48px', height: '48px' }} />
              <div className="vw-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>VortixWorld Bypass</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {(status === 'loading' || status === 'init' || status === 'success') && (
                <div className="vw-spinner" style={{ marginBottom: '20px' }}></div>
              )}

              <div className="vw-status" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {message}
              </div>

              {status === 'error' && (
                <div className="error" style={{ marginTop: '0' }}>
                  {error}
                </div>
              )}

              {status === 'captcha' && (
                <div className="hcaptcha-wrap" style={{ marginTop: '20px' }}>
                  <div id="hcaptcha-container"></div>
                </div>
              )}

              {status === 'result' && (
                <div className="result" style={{ width: '100%' }}>
                  <div className="result-body">
                    <pre className="result-pre">{resultText}</pre>
                    <div className="result-actions">
                      <button className="action-btn" onClick={() => copyToClipboard(resultText)}>
                        {copied ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .vw-icon-img {
          border-radius: 50%;
          border: 2px solid #3b82f6;
          object-fit: cover;
          background: rgba(0,0,0,0.2);
        }
        .vw-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(59,130,246,0.2);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .vw-status {
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }
      `}</style>
    </>
  )
}