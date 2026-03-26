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

  function handleLuarmorRedirect(resultUrl, returnUrl) {
    setMessage('Returning to userscript…')
    setStatus('success')
    setTimeout(() => {
      const sep = returnUrl.includes('?') ? '&' : '?'
      window.location.href = `${returnUrl}${sep}redirect=${encodeURIComponent(resultUrl)}`
    }, 800)
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
          const final = String(json.result)
          // Special case: if result is a luarmor URL and we have a return URL, redirect back
          if (isLuarmorUrl(final)) {
            const params = new URLSearchParams(window.location.search)
            const returnUrl = params.get('return')
            if (returnUrl) {
              handleLuarmorRedirect(final, returnUrl)
              return
            }
          }
          // For all other results (including non‑luarmor URLs), display in UI
          setResultText(final)
          setStatus('result')
          setMessage('Bypass Complete!')
          return
        }
        if (json.result && String(json.result).toLowerCase().includes('hcaptcha')) {
          setNeedsCaptcha(true)
          setStatus('captcha')
          setMessage('Complete captcha to continue')
          loadHCaptcha()
          setTimeout(() => renderHCaptcha(target), 300)
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

      <div className="userscript-container">
        <div className="card">
          <div className="userscript-header">
            <img src={LOGO_SRC} alt="VortixWorld" className="userscript-icon" />
            <div className="userscript-title">VortixWorld Bypass</div>
          </div>

          <div className="userscript-content">
            {(status === 'loading' || status === 'init' || status === 'success') && (
              <div className="vw-spinner"></div>
            )}

            <div className="vw-status">{message}</div>

            {status === 'error' && <div className="error">{error}</div>}

            {status === 'captcha' && (
              <div className="hcaptcha-wrap">
                <div id="hcaptcha-container"></div>
              </div>
            )}

            {status === 'result' && (
              <div className="result">
                <pre className="result-pre">{resultText}</pre>
                <button className="action-btn" onClick={() => copyToClipboard(resultText)}>
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .userscript-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .card {
          width: 100%;
          max-width: 600px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          padding: 32px 24px;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .userscript-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .userscript-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          object-fit: cover;
        }
        .userscript-title {
          font-size: 22px;
          font-weight: 800;
          color: #3b82f6;
        }
        .userscript-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
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
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .error {
          color: #ef4444;
          background: rgba(239,68,68,0.1);
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 14px;
        }
        .result {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 16px;
        }
        .result-pre {
          background: rgba(0,0,0,0.3);
          padding: 12px;
          border-radius: 16px;
          font-family: monospace;
          font-size: 13px;
          color: #94a3b8;
          word-break: break-all;
          white-space: pre-wrap;
          margin-bottom: 12px;
        }
        .action-btn {
          background: #f97316;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 40px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .action-btn:hover {
          background: #ea580c;
        }
      `}</style>
    </>
  )
}