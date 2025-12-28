import { useState } from 'react'
import Link from 'next/link'
export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="hamburger-wrap">
      <button aria-label="Open menu" className="hamburger-btn" onClick={() => setOpen(!open)}>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="22" height="2" rx="1" fill="white"/><rect y="6" width="22" height="2" rx="1" fill="white"/><rect y="12" width="22" height="2" rx="1" fill="white"/></svg>
      </button>
      {open && (
        <nav className="hamburger-nav" onClick={() => setOpen(false)}>
          <Link href="/"><a className="nav-link">Home</a></Link>
          <Link href="/supported"><a className="nav-link">Supported</a></Link>
          <Link href="/tos"><a className="nav-link">TOS</a></Link>
          <Link href="/privacy"><a className="nav-link">Privacy</a></Link>
        </nav>
      )}
    </div>
  )
}
