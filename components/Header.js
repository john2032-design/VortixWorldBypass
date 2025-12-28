import HamburgerMenu from './HamburgerMenu'
import Image from 'next/image'
export default function Header() {
  return (
    <header className="topbar">
      <div className="left">
        <HamburgerMenu />
        <div className="brand">
          <Image src="/BFB1896C-9FA4-4429-881A-38074322DFCB.png" alt="logo" width={52} height={52} className="logoimg" />
          <div className="titling">
            <h1>VortixWorld Bypass</h1>
            <p className="muted">Sideload & Bypass</p>
          </div>
        </div>
      </div>
    </header>
  )
}
