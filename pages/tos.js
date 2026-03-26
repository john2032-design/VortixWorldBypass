import Header from '../components/Header'
import Link from 'next/link'

export default function TOS() {
  return (
    <main className="page">
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Terms of Service</h2>
          <p><strong>Last updated:</strong> March 25, 2026</p>

          <p>Welcome to VortixWorld Bypass. By using our website (vortix-world-bypass.vercel.app) or installing and using our userscript, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

          <h3>1. Acceptance of Terms</h3>
          <p>Your access to and use of the VortixWorld Bypass website, API, and userscript (collectively, the “Service”) constitutes acceptance of these Terms. If you do not agree, you may not use the Service.</p>

          <h3>2. Description of Service</h3>
          <p>VortixWorld Bypass provides:</p>
          <ul>
            <li>A web interface where you can submit shortened URLs or ad‑protected links to retrieve the final destination URL.</li>
            <li>A userscript that automatically bypasses certain link shorteners, ad walls, and unlock mechanisms on supported websites.</li>
            <li>An API endpoint that processes bypass requests (used internally by the web interface and userscript).</li>
          </ul>
          <p>The Service is provided “as is” and may be modified, limited, or discontinued at any time without notice.</p>

          <h3>3. User Obligations</h3>
          <p>You agree to use the Service only for lawful purposes. You shall not:</p>
          <ul>
            <li>Distribute malicious or illegal content through the Service.</li>
            <li>Attempt to reverse engineer, scrape, or overload the Service, including its API.</li>
            <li>Use automated scripts or bots to access the API without explicit permission.</li>
            <li>Redistribute or sell access to the Service without prior written consent.</li>
          </ul>

          <h3>4. Intellectual Property</h3>
          <p>The VortixWorld Bypass name, logo, and all related trademarks are the property of VortixWorld. You may not use them without prior written consent. The userscript code is open source under the MIT license, but the website and API are proprietary. All other trademarks mentioned belong to their respective owners.</p>

          <h3>5. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, VortixWorld Bypass shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the Service. We do not guarantee that the bypass will work for every link or that the results will be accurate.</p>

          <h3>6. Disclaimer of Warranties</h3>
          <p>The Service is provided on an “AS IS” and “AS AVAILABLE” basis. We make no warranties, express or implied, regarding the operation or availability of the Service, or the accuracy, reliability, or completeness of any information provided.</p>

          <h3>7. Changes to Terms</h3>
          <p>We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any changes constitutes acceptance of the new Terms.</p>

          <h3>8. Termination</h3>
          <p>We may suspend or terminate your access to the Service at any time, for any reason, without notice or liability. This includes banning IP addresses, revoking API keys, or blocking userscript functionality.</p>

          <h3>9. Governing Law</h3>
          <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the service owner resides, without regard to its conflict of law provisions.</p>

          <h3>10. Contact Information</h3>
          <p>If you have any questions about these Terms, please contact us via the support channel on our Discord server (linked on the website).</p>

          <div style={{ marginTop: '24px' }}>
            <Link href="/" className="nav-back">← Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  )
}