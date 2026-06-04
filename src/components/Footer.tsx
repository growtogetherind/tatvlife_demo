import Link from 'next/link'
import { Mail, Phone, MapPin, Shield, Lock, Globe, Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--beige-100)', 
      color: 'var(--text-dark)', 
      marginTop: 'auto',
      borderTop: '1px solid var(--beige-200)'
    }}>
      {/* Trust Bar */}
      <div style={{ borderBottom: '1px solid var(--beige-200)', padding: '24px 0', background: 'var(--cream)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {[
            { icon: <Shield size={18} />, label: 'SSL Protected' },
            { icon: <Lock size={18} />, label: 'Secure Payments' },
            { icon: <Globe size={18} />, label: 'Worldwide Delivery' },
            { icon: <Leaf size={18} />, label: 'Genuine Medicines' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--green-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--green-800)',
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48 }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ 
                fontFamily: 'var(--font-serif)', 
                fontSize: 24, 
                fontWeight: 700, 
                color: 'var(--green-800)',
                letterSpacing: '-0.03em'
              }}>
                tatvlife
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 20 }}>
              Premium oncology medicines and supportive care products, delivered securely worldwide.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:care@tatvlife.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-800)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <Mail size={13} /> care@tatvlife.com
              </a>
              <a href="tel:+1800TATVLIFE" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-800)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <Phone size={13} /> +1-800-TATVLIFE
              </a>
              <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={13} /> Worldwide Delivery Available
              </span>
            </div>
          </div>

          {/* Care */}
          <div>
            <h4 style={{ 
              color: 'var(--green-800)', 
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, 
              fontSize: 15, 
              marginBottom: 20 
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/shop?category=chemotherapy', label: 'Chemotherapy' },
                { href: '/shop?category=immunotherapy', label: 'Immunotherapy' },
                { href: '/shop?category=targeted-therapy', label: 'Targeted Therapy' },
                { href: '/shop?category=hormonal-therapy', label: 'Hormonal Therapy' },
                { href: '/shop?category=supportive-care', label: 'Supportive Care' },
                { href: '/shop?category=pain-management', label: 'Pain Management' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-800)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ 
              color: 'var(--green-800)', 
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, 
              fontSize: 15, 
              marginBottom: 20 
            }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/faq', label: 'FAQ' },
                { href: '/dashboard', label: 'My Account' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-800)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ 
              color: 'var(--green-800)', 
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, 
              fontSize: 15, 
              marginBottom: 20 
            }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/shipping', label: 'Shipping Policy' },
                { href: '/refund', label: 'Refund Policy' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--green-800)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--beige-200)', padding: '24px 0', background: 'var(--cream)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} tatvlife. All rights reserved. For informational purposes only — consult your oncologist.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['BTC', 'ETH', 'USDT', 'USDC'].map(coin => (
              <span key={coin} style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px',
                background: 'var(--beige-100)', border: '1px solid var(--beige-200)', borderRadius: 6, color: 'var(--text-dark)'
              }}>{coin}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
