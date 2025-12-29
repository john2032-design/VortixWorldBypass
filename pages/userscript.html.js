import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const API_PROXY = '/api/proxy?url='

export default function UserscriptPage() {
  const router = useRouter()
  const [status, setStatus] = useState('init')
  const [message, setMessage] = useState('Preparing bypass...')
  const [resolved, setResolved] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return
    const params = new URLSearchParams(window.location.search)
    const target = params.get('url') || ''
    if (!target) {
      setStatus('error')
      setMessage('Missing url parameter')
      return
    }
    setStatus('loading')
    setMessage('Resolving link…')
    const doFetch = async () => {
      try {
        const res = await fetch(API_PROXY + encodeURIComponent(target), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          credentials: 'include'
        })
        const json = await res.json().catch(() => null)
        if (!json) {
          setStatus('error')
          setError('Invalid response from bypass API')
          setMessage('Invalid response from bypass API')
          return
        }
        if (json.status === 'success' && typeof json.result === 'string' && json.result) {
          const r = json.result
          setResolved(r)
          setStatus('done')
          setMessage('Resolved — redirecting…')
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
          return
        }
        setStatus('error')
        setError('Could not resolve link')
        setMessage('Could not resolve link')
      } catch (e) {
        setStatus('error')
        setError('Network error or API unreachable')
        setMessage('Network error or API unreachable')
      }
    }
    doFetch()
  }, [router.isReady])

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('')
  const incomingRedirect = params.get('redirect') || ''

  if (incomingRedirect) {
    if (incomingRedirect.includes('https://flux.li/android/external/main.php')) {
      return (
        <html>
          <head>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>VortixWorld USERSCRIPT</title>
          </head>
          <body style={{ height: '100%', margin: 0, padding: 0, background: 'linear-gradient(135deg,#000000 0%,#071033 60%,#1e2be8 100%)', color: '#ffffff', fontFamily: 'Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ maxWidth: 760, padding: 28, borderRadius: 12, background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.06))', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
              <h1 style={{ margin: 0, fontSize: 20 }}>VortixWorld USERSCRIPT</h1>
              <h2 style={{ margin: '8px 0 0 0', fontSize: 16 }}>Target requires manual redirect due to extra security checks</h2>
              <div style={{ marginTop: 12 }}>
                <a href={incomingRedirect} style={{ color: '#ffffff', background: 'linear-gradient(90deg,#0f1b4f,#1e2be8)', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Click here to continue</a>
              </div>
            </div>
          </body>
        </html>
      )
    } else {
      try {
        if (typeof window !== 'undefined') {
          window.location.href = incomingRedirect
          return null
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.open(incomingRedirect, '_blank', 'noopener,noreferrer')
          return null
        }
      }
    }
  }

  return (
    <main style={{ height: '100vh', margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#000000 0%,#071033 60%,#1e2be8 100%)', color: '#fff', fontFamily: 'Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif' }}>
      <div style={{ maxWidth: 760, padding: 28, borderRadius: 16, background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', textAlign: 'center' }}>
        <div style={{ marginBottom: 18 }}>
          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12, background: 'rgba(255,255,255,0.03)', padding: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" opacity="0.96"></path>
          </svg>
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{status === 'loading' ? 'Redirecting...' : status === 'done' ? 'Redirecting...' : status === 'error' ? 'Unable to resolve' : 'Preparing bypass'}</div>
        <div style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 18, fontSize: 14 }}>{message}</div>
        <div style={{ margin: '0 auto 14px auto', width: 56, height: 56, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.08)', borderTopColor: 'rgba(255,255,255,0.95)', animation: 'vbspin 1s linear infinite' }} />
        <div style={{ height: 8, borderRadius: 999, background: 'linear-gradient(90deg,#000 0%,#0f1b4f 40%,#1e2be8 100%)', marginTop: 18, boxShadow: '0 6px 24px rgba(30,43,232,0.24)' }} />
        {status === 'done' && resolved && (
          <div style={{ marginTop: 16 }}>
            <a href={resolved} style={{ color: '#ffffff', background: 'linear-gradient(90deg,#0f1b4f,#1e2be8)', padding: '10px 14px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }} rel="noopener noreferrer">Open destination</a>
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: '#ff6b6b', fontWeight: 700, marginBottom: 8 }}>{error || 'Could not resolve link'}</div>
            <div>
              <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload() }} style={{ color: '#ffffff', background: 'linear-gradient(90deg,#0f1b4f,#1e2be8)', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Try again</a>
            </div>
          </div>
        )}
        <style>{'@keyframes vbspin{100%{transform:rotate(360deg)}}'}</style>
      </div>
    </main>
  )
}
