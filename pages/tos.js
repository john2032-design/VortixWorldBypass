import Header from '../components/Header'
import Link from 'next/link'
export default function TOS() {
  return (
    <main className="page">
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Terms of Service</h2>
          <p>By using VortixWorld Bypass you agree to use the service only to bypass supported shortlinks for your own lawful purposes. You agree not to use the service for distribution of malicious content or violation of third party rights. The service is provided as-is without warranty. We reserve the right to block access, rate-limit, or suspend use at our sole discretion. You are responsible for ensuring your use complies with applicable laws and site terms of the links you bypass.</p>
          <div style={{marginTop:12}}>
            <Link href="/"><a className="nav-back">← Back</a></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
