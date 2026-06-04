'use client'

import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--beige-200)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="var(--green-800)" />
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-dark)' }}>
              Your Cart
            </span>
            {totalItems > 0 && (
              <span className="badge badge-green">{totalItems} items</span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <ShoppingBag size={48} color="var(--beige-300)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Your cart is empty</p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="btn-primary btn-sm"
                style={{ marginTop: 20, textDecoration: 'none', display: 'inline-flex' }}
              >
                Browse Medicines
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex', gap: 16,
                    background: 'var(--beige-100)',
                    borderRadius: 16, padding: 16,
                  }}
                >
                  {/* Product image */}
                  <div style={{
                    width: 72, height: 72, flexShrink: 0,
                    borderRadius: 12, background: 'var(--beige-200)',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.product_images?.[0]?.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.slug}/72/72` }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600, fontSize: 14, color: 'var(--text-dark)',
                      marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-800)', marginBottom: 10 }}>
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </p>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="qty-btn" onClick={() => updateQty(product.id, quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 24, textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button className="qty-btn" onClick={() => updateQty(product.id, quantity + 1)}>
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        style={{
                          marginLeft: 'auto', background: 'none', border: 'none',
                          cursor: 'pointer', color: '#ef4444', padding: 4
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: 24, borderTop: '1px solid var(--beige-200)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 20, fontSize: 16
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: 'var(--green-800)', fontSize: 20 }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary"
              style={{
                display: 'flex', width: '100%', justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-ghost"
              style={{ width: '100%', marginTop: 10 }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
