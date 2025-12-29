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
      callback: (token) => {
        attemptResolve(target, token)
      }
    })
  }

  function attemptResolve(target, token) {
    setStatus('loading')
    setMessage('Resolving link…')
    setError('')
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
          setMessage('Redirecting…')
          setTimeout(() => {
            window.location.href = json.result
          }, 400)
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
      <div className="us-card">
        <div className="us-logo">★</div>
        <h1 className="us-title">VortixWorld</h1>
        <p className="us-msg">{message}</p>

        {status === 'loading' && <div className="us-spinner" />}

        {status === 'captcha' && (
          <div className="us-captcha-wrap">
            <div id="hcaptcha-box" />
          </div>
        )}

        {status === 'error' && <div className="us-error">{error}</div>}
      </div>

      <style>{`
        html,body,#__next{
          height:100%;
          margin:0;
        }
        .us-root{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          background:linear-gradient(135deg,#04020a,#0f122a,#2f36c9);
          font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial;
          color:#eef2ff;
        }
        .us-card{
          width:100%;
          max-width:420px;
          padding:28px 22px 30px;
          border-radius:20px;
          background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02));
          box-shadow:0 30px 80px rgba(0,0,0,.55);
          border:1px solid rgba(255,255,255,.08);
          text-align:center;
        }
        .us-logo{
          width:72px;
          height:72px;
          margin:0 auto 14px;
          border-radius:18px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:34px;
          background:linear-gradient(135deg,#3b2be8,#7f8aff);
          box-shadow:0 10px 30px rgba(59,43,232,.5);
        }
        .us-title{
          margin:0;
          font-size:22px;
          font-weight:800;
          letter-spacing:.4px;
        }
        .us-msg{
          margin:10px 0 22px;
          color:rgba(255,255,255,.85);
          font-size:14.5px;
        }
        .us-spinner{
          width:52px;
          height:52px;
          margin:22px auto 0;
          border-radius:50%;
          border:5px solid rgba(255,255,255,.15);
          border-top-color:#fff;
          animation:spin .9s linear infinite;
        }
        .us-captcha-wrap{
          margin-top:16px;
          display:flex;
          justify-content:center;
        }
        .us-error{
          margin-top:16px;
          padding:10px 12px;
          border-radius:10px;
          background:rgba(255,77,109,.1);
          color:#ff6b7f;
          font-weight:700;
          font-size:14px;
        }
        @keyframes spin{
          to{transform:rotate(360deg)}
        }
        @media (max-width:420px){
          .us-card{
            padding:24px 18px;
          }
          .us-title{
            font-size:20px;
          }
        }
      `}</style>
    </main>
  )
}
