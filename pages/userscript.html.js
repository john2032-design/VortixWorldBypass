import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const API_PROXY = '/api/proxy?url='

export default function UserscriptPage() {
  const router = useRouter()
  const [status, setStatus] = useState('init')
  const [message, setMessage] = useState('Preparing bypass...')
  const [resolved, setResolved] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    const params = new URLSearchParams(window.location.search)
    const target = params.get('url') || ''
    const hcaptcha = params.get('hcaptcha') || params.get('hc') || params.get('h-captcha-response') || ''
    const incomingRedirect = params.get('redirect') || ''

    if (incomingRedirect) {
      if (incomingRedirect.includes('https://flux.li/android/external/main.php')) {
        document.documentElement.innerHTML = '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="height:100%;margin:0;padding:0;background:linear-gradient(135deg,#000000 0%,#071033 60%,#1e2be8 100%);color:#ffffff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;"><div style="max-width:760px;padding:28px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.06));box-shadow:0 20px 60px rgba(0,0,0,0.6);"><h1 style="margin:0 0 12px 0">VortixWorld USERSCRIPT</h1><h2 style="margin:0 0 8px 0;font-size:16px">Target requires manual redirect due to extra security checks</h2><div style="margin-top:12px"><a href="' + incomingRedirect + '" style="color:#ffffff;background:linear-gradient(90deg,#0f1b4f,#1e2be8);padding:10px 14px;border-radius:10px;text-decoration:none;font-weight:700">Click here to continue</a></div></div></body></html>'
        return
      } else {
        try {
          window.location.href = incomingRedirect
          return
        } catch {
          window.open(incomingRedirect, '_blank', 'noopener,noreferrer')
          return
        }
      }
    }

    if (!target) {
      setStatus('error')
      setMessage('Missing url parameter')
      setError('Missing url parameter')
      return
    }

    async function resolveOnce() {
      setBusy(true)
      setStatus('loading')
      setMessage('Resolving link…')
      try {
        const headers = { Accept: 'application/json' }
        if (hcaptcha) headers['x-hcaptcha-token'] = hcaptcha
        const res = await fetch(API_PROXY + encodeURIComponent(target), {
          method: 'GET',
          headers,
          credentials: 'include'
        })
        const json = await res.json().catch(() => null)
        if (!json) {
          setStatus('error')
          setError('Invalid response from bypass API')
          setMessage('Invalid response from bypass API')
          setBusy(false)
          return
        }
        if (json.status === 'success' && typeof json.result === 'string' && json.result) {
          const r = json.result
          setResolved(r)
          setStatus('done')
          setMessage('Resolved — redirecting…')
          setBusy(false)
          setTimeout(() => {
            try {
              window.location.href = r
            } catch {
              window.open(r, '_blank', 'noopener,noreferrer')
            }
          }, 300)
          return
        }
        if (json.status === 'error' && json.result) {
          setStatus('error')
          setError(String(json.result))
          setMessage(String(json.result))
          setBusy(false)
          return
        }
        setStatus('error')
        setError('Could not resolve link')
        setMessage('Could not resolve link')
        setBusy(false)
      } catch (e) {
        setStatus('error')
        setError('Network error or API unreachable')
        setMessage('Network error or API unreachable')
        setBusy(false)
      }
    }

    resolveOnce()
  }, [router.isReady])

  function tryAgain() {
    setStatus('loading')
    setMessage('Retrying...')
    setError('')
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    const target = params.get('url') || ''
    const hcaptcha = params.get('hcaptcha') || params.get('hc') || params.get('h-captcha-response') || ''
    if (!target) {
      setStatus('error')
      setMessage('Missing url parameter')
      return
    }
    const headers = { Accept: 'application/json' }
    if (hcaptcha) headers['x-hcaptcha-token'] = hcaptcha
    fetch(API_PROXY + encodeURIComponent(target), { method: 'GET', headers, credentials: 'include' })
      .then((r) => r.json().catch(() => null))
      .then((json) => {
        if (!json) {
          setStatus('error')
          setMessage('Invalid response from bypass API')
          setError('Invalid response from bypass API')
          return
        }
        if (json.status === 'success' && typeof json.result === 'string' && json.result) {
          try {
            window.location.href = json.result
          } catch {
            window.open(json.result, '_blank', 'noopener,noreferrer')
          }
          return
        }
        setStatus('error')
        setMessage(String(json.result || 'Could not resolve link'))
        setError(String(json.result || 'Could not resolve link'))
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error or API unreachable')
        setError('Network error or API unreachable')
      })
  }

  return (
    <main style={{ minHeight: '100vh', margin: 0, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#050213 0%,#0b0a1a 40%,#1a1b3a 100%)', color: '#fff', fontFamily: 'Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif' }}>
      <div style={{ width: 'min(840px,96%)', borderRadius: 16, padding: '20px', background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', boxShadow: '0 30px 80px rgba(6,6,10,0.6)', textAlign: 'center', maxWidth: 840 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 96, height: 96, borderRadius: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 36px rgba(0,0,0,0.6)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#fff" opacity="0.96" /></svg>
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800 }}>Resolving link…</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>{message}</p>
          <div style={{ marginTop: 18, width: '100%', maxWidth: 520 }}>
            <div style={{ height: 10, borderRadius: 999, background: 'linear-gradient(90deg,#000 0%,#0f1b4f 40%,#1e2be8 100%)', boxShadow: 'inset 0 -2px 12px rgba(0,0,0,0.6)' }} />
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.06)', borderTopColor: 'rgba(255,255,255,0.95)', animation: 'vspin 1s linear infinite' }} />
          </div>
          {status === 'error' && (
            <div style={{ marginTop: 18, width: '100%', maxWidth: 520 }}>
              <div style={{ color: '#ff6b6b', fontWeight: 700, marginBottom: 8 }}>{error}</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={tryAgain} style={{ background: 'linear-gradient(90deg,#0f1b4f,#1e2be8)', color: '#fff', padding: '10px 14px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
                <a href="#" onClick={(e) => { e.preventDefault(); const params = new URLSearchParams(window.location.search); const u = params.get('url') || ''; navigator.clipboard?.writeText(u); }} style={{ alignSelf: 'center', color: 'var(--muted)', textDecoration: 'underline' }}>Copy original URL</a>
              </div>
              <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.75)', fontSize: 13, textAlign: 'center' }}>
                Missing hCaptcha token will cause failure. To supply a token append <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: 6 }}> &hcaptcha=TOKEN </code> to this page URL or update your userscript to forward the token.
              </div>
            </div>
          )}
          {status === 'done' && resolved && (
            <div style={{ marginTop: 18 }}>
              <a href={resolved} rel="noopener noreferrer" style={{ background: 'linear-gradient(90deg,#0f1b4f,#1e2be8)', color: '#fff', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Open destination</a>
            </div>
          )}
        </div>
        <style>{'@keyframes vspin{100%{transform:rotate(360deg)}}'}</style>
      </div>
    </main>
  )
}
