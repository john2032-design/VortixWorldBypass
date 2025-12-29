import { useState } from 'react'
import { isValidUrl } from '../lib/api'

export default function ResultBox({ apiData, onCopy, copied, onOpen }) {
  const [showRaw, setShowRaw] = useState(false)
  const isError = apiData && apiData.status === 'error'
  const isSuccess = apiData && apiData.status === 'success'

  return (
    <div className={`result ${isError ? 'result-error' : isSuccess ? 'result-success' : ''}`}>
      <div className="result-head">
        <div className="status-pill">{isError ? 'Sadness — Bypass Failed :(' : isSuccess ? 'Success' : 'Result'}</div>
        <div className="meta">{apiData?.time_taken && <span className="time">API time: <strong>{apiData.time_taken}</strong></span>}</div>
      </div>
      <div className="result-body">
        <pre className="result-pre">{String(apiData?.result ?? '')}</pre>
        <div className="result-actions">
          <button className="action-btn" onClick={onCopy}>Copy</button>
          {isSuccess && isValidUrl(String(apiData?.result ?? '')) && <button className="action-btn action-open" onClick={onOpen}>Open</button>}
          <button className="action-btn" onClick={() => setShowRaw(!showRaw)}>{showRaw ? 'Hide raw' : 'Show raw'}</button>
        </div>
        {copied && <div className="copied">Copied!</div>}
      </div>

      <div className="raw">
        {showRaw && <pre className="small-pre" aria-live="polite">{JSON.stringify(apiData, null, 2)}</pre>}
      </div>
    </div>
  )
}
