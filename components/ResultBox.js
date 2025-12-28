import { isValidUrl } from '../lib/api'
export default function ResultBox({ apiData, onCopy, copied, onOpen }) {
  const isError = apiData && apiData.status === 'error'
  const isSuccess = apiData && apiData.status === 'success'
  return (
    <div className={`result ${isError ? 'result-error' : isSuccess ? 'result-success' : ''}`}>
      <div className="result-head">
        <div className="status-pill">{isError ? 'Sadness — Bypass Failed :(' : isSuccess ? 'Success' : 'Result'}</div>
        <div className="meta">{apiData?.time_taken && <span className="time">API time: <strong>{apiData.time_taken}</strong></span>}</div>
      </div>
      <div className="result-body">
        <pre className="result-pre">{String(apiData.result ?? '')}</pre>
        <div className="result-actions">
          <button className="action-btn" onClick={onCopy}>Copy</button>
          {isSuccess && isValidUrl(String(apiData.result ?? '')) && <button className="action-btn action-open" onClick={onOpen}>Open</button>}
        </div>
        {copied && <div className="copied">Copied!</div>}
      </div>
      <details className="raw">
        <summary>Raw response</summary>
        <pre className="small-pre">{JSON.stringify(apiData, null, 2)}</pre>
      </details>
    </div>
  )
}
