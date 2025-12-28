import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import ResultBox from '../components/ResultBox'
import { EXAMPLE_URLS, isAllowedUrlString, fetchBypass, copyText } from '../lib/api'
export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderText, setPlaceholderText] = useState(EXAMPLE_URLS[0])
  const [animKey, setAnimKey] = useState(0)
  const inputRef = useRef(null)
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
      const json = await fetchBypass(trimmed)
      if (!json) {
        setErrorMsg('Invalid response from API.')
        setLoading(false)
        return
      }
      setApiData(json)
    } catch {
      setErrorMsg('Network error or API unreachable.')
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
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Paste a supported link to bypass</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-wrap">
              <input
                ref={inputRef}
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
      <footer className="footer">
      </footer>
    </main>
  )
}
