import Header from '../components/Header'
import Link from 'next/link'
export default function Privacy() {
  return (
    <main className="page">
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Privacy Policy</h2>
          <p>VortixWorld Bypass collects minimal data needed to operate the service. API calls to the bypass endpoint may log the requested URL and the resulting status for diagnostics and abuse prevention. We do not sell personal data. If a user provides identifiers those may be used for debugging. By using the service you consent to these minimal logs. If you need data deletion please contact the site administrator for removal.</p>
          <div style={{marginTop:12}}>
            <Link href="/"><a className="nav-back">← Back</a></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
