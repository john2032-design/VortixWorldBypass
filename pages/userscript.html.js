import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const API_PROXY = '/api/proxy?url='
const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY

export default function UserscriptPage() {
  const router = useRouter()
  const [status, setStatus] = useState('init')
  const [message, setMessage] = useState('Preparing bypass…')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [resolved, setResolved] = useState('')
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

  function renderHCaptcha() {
    if (!window.hcaptcha || !document.getElementById('hcaptcha-box')) return
    window.hcaptcha.render('hcaptcha-box', {
      sitekey: HCAPTCHA_SITEKEY,
      callback: (t) => {
        setToken(t)
        const params = new URLSearchParams(window.location.search)
        const target = params.get('url')
        attemptResolve(target, t)
      }
    })
  }

  function attemptResolve(target, htoken) {
    setStatus('loading')
    setMessage('Resolving link…')
    setError('')
    const headers = { Accept: 'application/json' }
    if (htoken) headers['x-hcaptcha-token'] = htoken
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
          setResolved(json.result)
          setStatus('done')
          setMessage('Redirecting…')
          setTimeout(() => {
            window.location.href = json.result
          }, 300)
          return
        }
        if (json.result && String(json.result).toLowerCase().includes('hcaptcha')) {
          setNeedsCaptcha(true)
          setStatus('captcha')
          setMessage('Please complete captcha to continue')
          loadHCaptcha()
          setTimeout(renderHCaptcha, 300)
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
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#050213,#0b0a1a,#1a1b3a)', color: '#fff', fontFamily: 'Inter,system-ui,Arial', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 520, padding: 28, borderRadius: 18, background: 'rgba(255,255,255,0.03)', boxShadow: '0 30px 80px rgba(0,0,0,.6)', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Vortix World</h1>
        <p style={{ opacity: .9, marginTop: 8 }}>{message}</p>

        {status === 'loading' && (
          <div style={{ marginTop: 24, width: 56, height: 56, borderRadius: '50%', border: '6px solid rgba(255,255,255,.1)', borderTopColor: '#fff', animation: 'spin 1s linear infinite', marginInline: 'auto' }} />
        )}

        {status === 'captcha' && (
          <div style={{ marginTop: 22 }}>
            <div id="hcaptcha-box" />
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 18, color: '#ff6b6b', fontWeight: 700 }}>{error}</div>
        )}

        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      </div>
    </main>
  )
}
