'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })

  const prefillAdmin = () => {
    setForm({ full_name: '', email: 'admin@gmail.com', password: 'password1234' })
  }

  const prefillCustomer = () => {
    setForm({ full_name: '', email: 'customer@gmail.com', password: 'password1234' })
  }

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password
    })
    
    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    // Retrieve role to determine redirect
    let role = 'customer'
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()
      if (profile?.role) {
        role = profile.role
      }
    } catch (err) {
      console.warn('Failed to query user profile role, using default:', err)
    }

    setLoading(false)
    if (form.email === 'admin@gmail.com' || role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess('Account created! Please check your email to verify your account.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--beige-100)' }}>
        <div className="modal-box" style={{ maxWidth: 440, padding: '48px', boxShadow: 'var(--shadow-lg)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, background: 'var(--green-800)', borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: 'white', fontWeight: 700, fontSize: 24,
              fontFamily: 'var(--font-serif)'
            }}>T</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--text-dark)' }}>
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
              {tab === 'login' ? 'Sign in to your Tatvlife account' : 'Join thousands of patients worldwide'}
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'var(--beige-100)', borderRadius: 12, padding: 4, marginBottom: 32
          }}>
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess('') }}
                style={{
                  padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--green-800)' : 'var(--text-muted)',
                  boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={48} color="var(--green-500)" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Check your email!</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{success}</p>
              <button onClick={() => { setTab('login'); setSuccess('') }} className="btn-primary" style={{ marginTop: 20 }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={tab === 'login' ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {tab === 'signup' && (
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
              )}
              <div>
                <label className="label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: '#fee2e2', border: '1px solid #fca5a5',
                  borderRadius: 10, padding: '12px 16px',
                  color: '#dc2626', fontSize: 14
                }}>
                  {error}
                </div>
              )}

              {tab === 'login' && (
                <div style={{ textAlign: 'right', marginTop: -8 }}>
                  <Link href="/auth/forgot-password" style={{ fontSize: 13, color: 'var(--green-600)', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
                {tab === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                  style={{ color: 'var(--green-600)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
                >
                  {tab === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              {tab === 'login' && (
                <div style={{
                  borderTop: '1px dashed var(--beige-300)',
                  paddingTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Demo Credentials (1-Click)
                  </span>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={prefillAdmin}
                      style={{
                        padding: '6px 16px', borderRadius: 9999, border: '1px solid var(--green-600)',
                        background: 'var(--green-50)', color: 'var(--green-800)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={prefillCustomer}
                      style={{
                        padding: '6px 16px', borderRadius: 9999, border: '1px solid var(--beige-300)',
                        background: 'white', color: 'var(--text-dark)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Customer
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
