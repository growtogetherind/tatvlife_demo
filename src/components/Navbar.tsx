'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CartDrawer from './CartDrawer'

const ANNOUNCEMENTS = [
  "🌿 Authentic WHO-approved oncology medications sourced directly from verified manufacturers.",
  "💳 Secure, encrypted checkout with instant on-chain crypto payment verification (BTC, ETH, USDT, USDC).",
  "📦 Discreet, temperature-controlled priority packaging with worldwide insured shipping.",
  "⚡ Flat 10% off for first-time buyers using coupon code: FIRST10 at checkout."
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, setIsOpen } = useCart()
  const { user, profile, isAdmin, signOut } = useAuth()
  
  const [adIndex, setAdIndex] = useState(0)
  const [fade, setFade] = useState('fade-in')

  useEffect(() => {
    const timer = setInterval(() => {
      setFade('fade-out')
      setTimeout(() => {
        setAdIndex(prev => (prev + 1) % ANNOUNCEMENTS.length)
        setFade('fade-in')
      }, 300)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'Shop Medicines' },
  ]

  return (
    <>
      {/* Promo bar */}
      <div className="promo-bar">
        <span className={`promo-bar-transition ${fade}`} style={{ display: 'inline-block' }}>
          {ANNOUNCEMENTS[adIndex]}
        </span>
      </div>

      <header style={{
        background: 'var(--cream)',
        borderBottom: '1px solid var(--beige-200)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 72 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: 32 }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--green-800)',
              letterSpacing: '-0.03em'
            }}>
              tatvlife
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 4, flex: 1 }} className="hidden-mobile">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                style={{ padding: '6px 12px' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 9999,
                background: 'var(--beige-100)', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: 14,
                color: 'var(--text-dark)', transition: 'all 0.2s', position: 'relative'
              }}
            >
              <ShoppingBag size={18} />
              <span className="hidden-mobile">Cart</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'var(--green-600)', color: 'white',
                  borderRadius: '50%', width: 18, height: 18,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 9999,
                    background: 'var(--green-100)', border: 'none',
                    cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    color: 'var(--green-800)', transition: 'all 0.2s'
                  }}
                >
                  <User size={16} />
                  <span className="hidden-mobile">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 30 }}
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: 'white', borderRadius: 16, border: '1px solid var(--beige-200)',
                      boxShadow: 'var(--shadow-lg)', minWidth: 200, zIndex: 31, overflow: 'hidden',
                    }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--beige-200)' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{profile?.full_name || user.email}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{user.email}</div>
                      </div>
                      <div style={{ padding: 8 }}>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 10,
                            color: 'var(--text-dark)', textDecoration: 'none',
                            fontSize: 14, fontWeight: 500, transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--beige-100)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LayoutDashboard size={15} /> My Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 12px', borderRadius: 10,
                              color: 'var(--green-700)', textDecoration: 'none',
                              fontSize: 14, fontWeight: 500, transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-50)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Shield size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 10, width: '100%',
                            color: '#dc2626', background: 'transparent', border: 'none',
                            fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--beige-200)', padding: '16px 0' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                  onClick={() => setMobileOpen(false)}
                  style={{ padding: '12px 4px', borderBottom: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <CartDrawer />

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
