import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
    window.hcaptcha.render('hcaptcha-box', {
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
      }).catch(() => {
        fallbackCopy(text)
      })
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
    } catch (e) {
    }
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
    <div className="bh-root">
      <div className="bh-header-bar">
        <div className="bh-title">
          <img src={LOGO_SRC} className="bh-header-icon" alt="Icon" />
          VortixWorld
        </div>
      </div>

      <div className="bh-main-content">
        <img src={LOGO_SRC} className="bh-icon-img" alt="VortixWorld" />

        {(status === 'loading' || status === 'init' || status === 'success') && (
          <div className="bh-spinner-container">
            <div className="bh-spinner-outer"></div>
            <div className="bh-spinner-inner"></div>
            <div className="bh-spinner-dot"></div>
          </div>
        )}

        <div className="bh-status" style={{ color: status === 'error' ? '#ff6b7f' : status === 'result' ? '#4ade80' : '#fff' }}>
          {message}
        </div>

        {status === 'error' && <div className="bh-substatus">{error}</div>}

        {status === 'captcha' && (
          <div className="bh-captcha-container">
            <div id="hcaptcha-box" />
          </div>
        )}

        {status === 'result' && (
          <div className="bh-result-area">
            <input
              type="text"
              className="bh-input"
              readOnly
              value={resultText}
              onClick={(e) => e.target.select()}
            />
            <button className="bh-btn" onClick={() => copyToClipboard(resultText)}>
              {copied ? '✅ Copied!' : '📋 Copy URL'}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #020617, #000000);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
          color: #fff;
        }

        .bh-root {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .bh-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(2, 6, 23, 0.95);
          border-bottom: 1px solid #1e293b;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .bh-title {
          font-weight: 800;
          font-size: 24px;
          color: #38bdf8;
          display: flex;
          align-items: center;
          gap: 15px;
          text-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }

        .bh-header-icon {
          height: 35px;
          width: 35px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #38bdf8;
        }

        .bh-main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 600px;
          padding: 20px;
          animation: bh-fade-in 0.6s ease-out;
          position: relative;
          z-index: 10;
          margin-top: 60px;
        }

        .bh-icon-img {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          margin-bottom: 25px;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
          object-fit: cover;
        }

        .bh-status {
          font-size: 22px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .bh-substatus {
          font-size: 15px;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 15px;
        }

        .bh-spinner-container {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 30px;
        }

        .bh-spinner-outer {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #38bdf8;
          border-right: 4px solid #38bdf8;
          border-radius: 50%;
          animation: bh-spin 1s linear infinite;
        }

        .bh-spinner-inner {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 44px;
          height: 44px;
          border: 4px solid transparent;
          border-bottom: 4px solid #7dd3fc;
          border-left: 4px solid #7dd3fc;
          border-radius: 50%;
          animation: bh-spin-reverse 0.8s linear infinite;
        }

        .bh-spinner-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #38bdf8;
          border-radius: 50%;
          animation: bh-pulse 1s ease-in-out infinite;
        }

        .bh-captcha-container {
          margin-top: 15px;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .bh-result-area {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }

        .bh-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #38bdf8;
          color: #7dd3fc;
          padding: 16px;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          font-family: monospace;
          text-align: center;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.1);
          box-sizing: border-box;
        }

        .bh-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          padding: 16px 20px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          text-transform: uppercase;
          transition: all 0.2s;
          font-size: 15px;
          letter-spacing: 1px;
          box-shadow: 0 5px 20px rgba(14, 165, 233, 0.3);
        }

        .bh-btn:hover {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          transform: translateY(-2px);
        }

        .bh-btn:active {
          transform: scale(0.98);
        }

        @keyframes bh-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bh-spin-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes bh-pulse { 0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); } }
        @keyframes bh-fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 480px) {
          .bh-header-bar { padding: 0 15px; }
          .bh-title { font-size: 18px; }
          .bh-main-content { padding: 15px; }
        }
      `}</style>
    </div>
  )
}
