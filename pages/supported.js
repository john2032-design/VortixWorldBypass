import Header from '../components/Header'
import Link from 'next/link'
import { ALLOWED_HOSTS } from '../lib/api'
export default function Supported() {
  return (
    <main className="page">
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Supported Domains</h2>
          <div className="supported-list">
            {ALLOWED_HOSTS.map((d) => (
              <div key={d} className="supported-item">{d}</div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <Link href="/"><a className="nav-back">← Back</a></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
