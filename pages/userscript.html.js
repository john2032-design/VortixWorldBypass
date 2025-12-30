import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const API_PROXY = '/api/proxy?url='
const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY

export default function UserscriptPage() {
  const router = useRouter()
  const [status, setStatus] = useState('init')
  const [message, setMessage] = useState('Preparing bypass…')
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

  function copyToClipboard(text) {
    if (!text) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
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
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
    }
    document.body.removeChild(ta)
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
          return
        }
        if (json.status === 'success' && json.result) {
          if (isValidUrl(json.result)) {
            setMessage('Redirecting…')
            setTimeout(() => {
              window.location.href = json.result
            }, 400)
            return
          } else {
            setResultText(String(json.result))
            setStatus('result')
            setMessage('Result')
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
          setMessage('Redirecting…')
          setTimeout(() => {
            window.location.href = json.result
          }, 400)
          return
        }
        if (json.result) {
          setResultText(String(json.result))
          setStatus('result')
          setMessage('Result')
          return
        }
        setStatus('error')
        setError(String(json.result || 'Unable to resolve'))
      })
      .catch(() => {
        setStatus('error')
        setError('Network error')
      })
  }

  return (
    <main className="us-root">
      <div className="us-center">
        <div className="us-logo" aria-hidden>★</div>
        <h1 className="us-title">VortixWorld</h1>
        <p className="us-msg" id="us-message">{message}</p>

        {status === 'loading' && <div className="us-spinner" aria-hidden />}

        {status === 'captcha' && (
          <div className="us-captcha">
            <div id="hcaptcha-box" />
          </div>
        )}

        {status === 'result' && (
          <div className="us-result" role="region" aria-label="Result">
            <pre className="us-result-text" id="result-text">{resultText}</pre>
            <button className="us-copy-btn" onClick={() => copyToClipboard(resultText)} aria-label="Copy result">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        {status === 'error' && <div className="us-error" role="alert">{error}</div>}
      </div>

      <style>{`
        html,body,#__next{
          height:100%;
          margin:0;
          padding:0;
          background-color:#071028;
          background-image:none;
          overflow-x:hidden;
        }
        .us-root{
          min-height:100vh;
          width:100vw;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:env(safe-area-inset-top) 20px env(safe-area-inset-bottom);
          background-color:#071028;
          font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
          color:#ffffff;
          text-align:center;
          box-sizing:border-box;
          overflow-x:hidden;
        }
        .us-center{
          width:100%;
          max-width:520px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:12px;
          padding:18px;
          box-sizing:border-box;
          background-color:transparent;
        }
        .us-logo{
          width:64px;
          height:64px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:34px;
          background:transparent;
          color:#ffffff;
          border-radius:8px;
          margin:0;
        }
        .us-title{
          margin:0;
          font-size:22px;
          font-weight:800;
          letter-spacing:0.3px;
        }
        .us-msg{
          margin:0;
          font-size:15px;
          opacity:0.95;
          line-height:1.3;
        }
        .us-spinner{
          width:46px;
          height:46px;
          margin-top:6px;
          border-radius:50%;
          border:4px solid rgba(255,255,255,0.18);
          border-top-color:#ffffff;
          animation:spin .9s linear infinite;
        }
        .us-captcha{
          width:100%;
          display:flex;
          justify-content:center;
          margin-top:8px;
        }
        #hcaptcha-box{
          width:100%;
          max-width:420px;
        }
        .us-result{
          width:100%;
          margin-top:12px;
          display:flex;
          gap:10px;
          align-items:center;
          justify-content:space-between;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.04);
          padding:12px;
          border-radius:8px;
          box-sizing:border-box;
          backdrop-filter:blur(6px);
        }
        .us-result-text{
          margin:0;
          padding:0;
          font-size:14px;
          color:#e6eef8;
          text-align:left;
          white-space:pre-wrap;
          word-break:break-word;
          flex:1 1 auto;
          background:transparent;
          border:0;
        }
        .us-copy-btn{
          margin-left:12px;
          flex:0 0 auto;
          padding:8px 12px;
          font-size:14px;
          font-weight:700;
          background:#0f63ff;
          color:#fff;
          border-radius:8px;
          border:0;
          cursor:pointer;
          min-width:72px;
        }
        .us-copy-btn:active{transform:scale(.98)}
        .us-error{
          margin-top:8px;
          color:#ff6b7f;
          font-weight:700;
          font-size:14px;
        }
        @keyframes spin{
          to{transform:rotate(360deg)}
        }
        @media (max-width:420px){
          .us-title{font-size:20px}
          .us-logo{width:56px;height:56px;font-size:30px}
          .us-spinner{width:40px;height:40px;border-width:3px}
          .us-center{padding:16px}
          .us-result{flex-direction:column;align-items:stretch}
          .us-copy-btn{width:100%;margin-left:0;margin-top:8px}
        }
        @media (min-width:900px){
          .us-root{padding:40px}
          .us-center{max-width:640px;padding:28px}
          .us-title{font-size:26px}
        }
      `}</style>
    </main>
  )
}
