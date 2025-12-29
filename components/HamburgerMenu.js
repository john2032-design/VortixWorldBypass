import { useState } from 'react'
import Link from 'next/link'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="hamburger-wrap">
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className={`hamburger-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="bar top" />
        <span className="bar mid" />
        <span className="bar bot" />
      </button>

      <nav className={`hamburger-nav ${open ? 'show' : ''}`} onClick={() => setOpen(false)}>
        <Link href="/"><a className="nav-link">Home</a></Link>
        <Link href="/supported"><a className="nav-link">Supported</a></Link>
        <Link href="/tos"><a className="nav-link">TOS</a></Link>
        <Link href="/privacy"><a className="nav-link">Privacy</a></Link>
      </nav>

      {open && (
        <div className="hamburger-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
    </div>
  )
}
