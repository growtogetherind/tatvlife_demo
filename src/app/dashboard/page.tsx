'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, User, MapPin, Loader2 } from 'lucide-react'
import type { Order } from '@/types'

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  pending_payment: { color: '#92400e', bg: '#fef3c7', label: 'Pending Payment', icon: Clock },
  paid: { color: '#065f46', bg: '#d1fae5', label: 'Paid', icon: CheckCircle2 },
  processing: { color: '#1e40af', bg: '#dbeafe', label: 'Processing', icon: Package },
  shipped: { color: '#5b21b6', bg: '#ede9fe', label: 'Shipped', icon: Truck },
  delivered: { color: '#065f46', bg: '#d1fae5', label: 'Delivered', icon: CheckCircle2 },
  cancelled: { color: '#991b1b', bg: '#fee2e2', label: 'Cancelled', icon: Clock },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { color: '#6b7280', bg: '#f3f4f6', label: status, icon: Clock }
  const Icon = cfg.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 9999,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em'
    }}>
      <Icon size={11} /> {cfg.label}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [tab, setTab] = useState<'orders' | 'profile'>('orders')
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      setLoadingOrders(true)
      const { data } = await supabase
        .from('orders')
        .select('*, addresses(*), order_items(*, products(name, price)), payments(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setOrders(data as Order[])
      setLoadingOrders(false)
    }
    fetchOrders()
  }, [user]) // eslint-disable-line

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--green-600)' }} />
      </div>
    )
  }

  if (!user) return null

  const totalSpent = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total_amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'var(--green-900)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--green-500)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 24
            }}>
              {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700 }}>
                {profile?.full_name || 'My Account'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {[
              { label: 'Total Orders', value: orders.length },
              { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}` },
              { label: 'Active Orders', value: orders.filter(o => ['pending_payment', 'processing', 'shipped'].includes(o.order_status)).length },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: '40px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--beige-100)', borderRadius: 12, padding: 4, marginBottom: 32, width: 'fit-content' }}>
          {[
            { key: 'orders', label: 'My Orders', icon: <Package size={15} /> },
            { key: 'profile', label: 'Profile', icon: <User size={15} /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                background: tab === t.key ? 'white' : 'transparent',
                color: tab === t.key ? 'var(--green-800)' : 'var(--text-muted)',
                boxShadow: tab === t.key ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Loader2 size={32} style={{ animation: 'spin 0.7s linear infinite', color: 'var(--green-500)', margin: '0 auto' }} />
              </div>
            ) : orders.length === 0 ? (
              <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                <ShoppingBag size={48} color="var(--beige-300)" style={{ marginBottom: 16 }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Start shopping to see your orders here.</p>
                <Link href="/shop" className="btn-primary">Browse Medicines</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {orders.map(order => (
                  <div key={order.id} className="card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <StatusBadge status={order.order_status} />
                        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--green-800)' }}>₹{order.total_amount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div style={{ background: 'var(--beige-100)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        {order.order_items.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                            <span style={{ color: 'var(--text-muted)' }}>
                              {item.products?.name || 'Product'} × {item.quantity}
                            </span>
                            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Shipping Address and Payment Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13, marginBottom: 16, borderTop: '1px dashed var(--beige-300)', paddingTop: 16 }}>
                      {order.addresses ? (
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.04em' }}>Shipping to</div>
                          <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                            <strong>{order.addresses.full_name}</strong><br />
                            {order.addresses.address_line}<br />
                            {order.addresses.city}, {order.addresses.state} - {order.addresses.postal_code}<br />
                            {order.addresses.country}
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No shipping details</div>
                      )}

                      {order.payments && order.payments.length > 0 ? (
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.04em' }}>Payment Info</div>
                          {order.payments.map(pm => (
                            <div key={pm.id} style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <div>Gateway: <strong>{pm.gateway.toUpperCase()}</strong></div>
                              <div>Tx Hash: <code style={{ fontSize: 11, wordBreak: 'break-all', color: 'var(--green-700)' }}>{pm.transaction_hash || 'Pending Submission'}</code></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No payment details</div>
                      )}
                    </div>

                    {/* Payment status */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Payment: <strong style={{ color: order.payment_status === 'paid' ? 'var(--green-600)' : '#d97706' }}>
                          {order.payment_status === 'paid' ? '✓ Paid' : '⏳ Awaiting Payment'}
                        </strong>
                      </span>
                      {order.payment_status !== 'paid' && order.payments && order.payments[0]?.payment_link && (
                        <a 
                          href={order.payments[0].payment_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-primary btn-sm"
                          style={{ padding: '6px 16px', fontSize: 12, textDecoration: 'none' }}
                        >
                          Complete Payment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="card" style={{ padding: 32, maxWidth: 560 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Profile Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" defaultValue={profile?.full_name || ''} disabled />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input" defaultValue={user.email || ''} disabled />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" defaultValue={profile?.phone || ''} disabled placeholder="Not set" />
              </div>
              <div>
                <label className="label">Role</label>
                <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>{profile?.role || 'customer'}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button
                  onClick={signOut}
                  style={{
                    padding: '12px 24px', borderRadius: 9999, border: '1.5px solid #ef4444',
                    color: '#ef4444', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
