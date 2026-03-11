'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#f2ede4]/95 backdrop-blur-sm border-b border-[#c8c0b0]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="font-display font-semibold text-sm text-[#1a1a18]">MBA Skills Index</span>
        </Link>
        <div className="flex items-center gap-8">
          {[{ href: '/', label: 'Compare' }, { href: '/methodology', label: 'Methodology' }].map(({ href, label }) => (
            <Link key={href} href={href}
              className={`text-sm link-underline transition-colors ${pathname === href ? 'text-[#10b981] font-medium' : 'text-[#6b6557] hover:text-[#1a1a18]'}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
