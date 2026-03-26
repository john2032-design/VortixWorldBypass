import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="topbar">
      <div className="left">
        <div className="brand">
          <Image
            src="/BFB1896C-9FA4-4429-881A-38074322DFCB.png"
            alt="logo"
            width={52}
            height={52}
            className="logoimg"
          />
          <div className="titling">
            <h1>VortixWorld Bypass</h1>
            <p className="muted">Sideload & Bypass</p>
          </div>
        </div>
      </div>

      <nav className="nav-links">
        <Link href="/" className="nav-link-btn">Home</Link>
        <Link href="/supported" className="nav-link-btn">Supported</Link>
        <Link href="/tos" className="nav-link-btn">TOS</Link>
        <Link href="/privacy" className="nav-link-btn">Privacy</Link>
      </nav>

      <div className="right">
        <a
          className="userscript-btn"
          href="https://vortixworlduserscript.vercel.app/raw/bypass.user.js"
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M7 8L3 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 4H10v16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Get Userscript</span>
        </a>
      </div>
    </header>
  )
}