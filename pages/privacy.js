import Header from '../components/Header'
import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="page">
      <Header />
      <section className="hero">
        <div className="card">
          <h2>Privacy Policy</h2>
          <p><strong>Effective date:</strong> March 25, 2026</p>

          <p>VortixWorld Bypass respects your privacy. This policy describes the limited data we collect from both the website and the userscript, and how we use it.</p>

          <h3>1. Information We Collect</h3>
          <p>We collect minimal information necessary to operate the Service:</p>
          <ul>
            <li><strong>Bypass Requests (Website & API):</strong> The URL you submit is sent to our API to process the bypass. The URL and the resulting status may be logged temporarily for diagnostics, abuse prevention, and performance improvement. No personal identifiers are stored with these logs.</li>
            <li><strong>Userscript Activity:</strong> The userscript operates locally in your browser. It does not send any data to our servers except the bypass request (via the API) when you use it on a supported site. The same logging applies as for website requests.</li>
            <li><strong>Captcha Tokens:</strong> If a captcha is required, we may receive a token from the captcha provider (hCaptcha) to validate that you are human. This token is not stored beyond the request.</li>
            <li><strong>Server Logs:</strong> Standard web server logs may record IP addresses, browser user agents, and timestamps for security and troubleshooting. These logs are retained for a limited time (typically 30 days) and are not shared with third parties except as required by law.</li>
            <li><strong>Local Storage (Userscript):</strong> The userscript stores your preferences (e.g., auto‑redirect toggle) locally using your browser's localStorage. This data never leaves your device.</li>
          </ul>
          <p>We do not collect personally identifiable information such as your name, email, or precise location.</p>

          <h3>2. How We Use Information</h3>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and improve the bypass service for both the website and userscript.</li>
            <li>Monitor and prevent abuse, fraud, or technical issues (e.g., excessive requests).</li>
            <li>Analyze usage patterns to optimize performance and compatibility with new link types.</li>
          </ul>

          <h3>3. Cookies and Local Storage</h3>
          <p>The website does not use cookies for tracking. It may use local storage to remember your settings. The userscript also uses local storage (as described above). No third‑party cookies are set by our Service.</p>

          <h3>4. Third‑Party Services</h3>
          <p>We use hCaptcha to prevent automated abuse on the website and API. hCaptcha may collect certain data as described in their <a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>. We do not share your data with any other third parties.</p>

          <h3>5. Data Retention</h3>
          <p>Log entries are kept for a maximum of 30 days for diagnostic purposes. Bypass results are not permanently stored. If you have a specific request for data deletion, please contact us and we will make reasonable efforts to accommodate it.</p>

          <h3>6. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with a new effective date. Your continued use of the Service after the changes constitutes acceptance of the updated policy.</p>

          <h3>7. Contact Us</h3>
          <p>If you have any questions or concerns about this Privacy Policy or your data, please reach out via our Discord server or the contact methods provided on the main site.</p>

          <div style={{ marginTop: '24px' }}>
            <Link href="/" className="nav-back">← Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  )
}