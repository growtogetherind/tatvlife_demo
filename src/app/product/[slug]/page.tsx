'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import {
  ShoppingBag, Plus, Minus, Star, Shield, Truck,
  Package, ArrowLeft, CheckCircle2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react'

// Static fallback matching what the shop page shows (in INR)
const STATIC_PRODUCTS: Product[] = [
  { id: '1', name: 'Temozolomide (Temodar) 100mg', slug: 'temozolomide-temodar-100mg', description: 'An alkylating chemotherapy agent used for the treatment of newly diagnosed glioblastoma multiforme and refractory anaplastic astrocytoma. Provided in oral capsule form for convenient home administration.', manufacturer: 'Merck & Co.', price: 23920, stock: 50, dosage: '150mg/m² or as directed by oncologist. Take once daily on an empty stomach at bedtime.', side_effects: 'Nausea, vomiting, headache, fatigue, anorexia, thrombocytopenia, leukopenia.', category_id: 'chemotherapy', featured: true, active: true, created_at: '', categories: { name: 'Chemotherapy', slug: 'chemotherapy' }, product_images: [] },
  { id: '2', name: 'Capecitabine (Xeloda) 500mg', slug: 'capecitabine-xeloda-500mg', description: 'An orally-administered chemotherapy agent that is enzymatically converted to 5-fluorouracil in the tumor. Commonly prescribed for colorectal, gastric, and breast cancers.', manufacturer: 'Genentech', price: 27920, stock: 40, dosage: '1250mg/m² twice daily for 14 days, followed by a 7-day rest period. Take with water within 30 minutes after meals.', side_effects: 'Diarrhea, nausea, hand-foot syndrome, vomiting, abdominal pain, fatigue, hyperbilirubinemia.', category_id: 'chemotherapy', featured: true, active: true, created_at: '', categories: { name: 'Chemotherapy', slug: 'chemotherapy' }, product_images: [] },
  { id: '3', name: 'Imatinib (Gleevec) 400mg', slug: 'imatinib-gleevec-400mg', description: 'A tyrosine kinase inhibitor targeted therapy designed to block the abnormal BCR-ABL protein. Highly effective for Chronic Myelogenous Leukemia (CML) and Gastrointestinal Stromal Tumors (GIST).', manufacturer: 'Novartis', price: 36000, stock: 30, dosage: '400mg daily or as directed. Take with a meal and a large glass of water to minimize gastrointestinal irritation.', side_effects: 'Fluid retention, muscle cramps, nausea, diarrhea, skin rash, fatigue, abdominal pain.', category_id: 'targeted-therapy', featured: true, active: true, created_at: '', categories: { name: 'Targeted Therapy', slug: 'targeted-therapy' }, product_images: [] },
  { id: '4', name: 'Erlotinib (Tarceva) 150mg', slug: 'erlotinib-tarceva-150mg', description: 'An EGFR inhibitor targeted therapy used for Non-Small Cell Lung Cancer (NSCLC) and pancreatic cancer. Selectively blocks cell signaling pathways that promote tumor growth.', manufacturer: 'Astellas / Genentech', price: 30400, stock: 25, dosage: '150mg once daily. Take on an empty stomach, at least 1 hour before or 2 hours after food.', side_effects: 'Diarrhea, acneiform rash, dry skin, fatigue, cough, nausea, breathing difficulty.', category_id: 'targeted-therapy', featured: false, active: true, created_at: '', categories: { name: 'Targeted Therapy', slug: 'targeted-therapy' }, product_images: [] },
  { id: '5', name: 'Tamoxifen Citrate 20mg', slug: 'tamoxifen-citrate-20mg', description: 'A selective estrogen receptor modulator (SERM) used for the prevention and treatment of receptor-positive breast cancers. Acts by blocking estrogen stimulation of cancer cells.', manufacturer: 'AstraZeneca', price: 7120, stock: 150, dosage: '20mg once daily in the morning or evening. Can be taken with or without food.', side_effects: 'Hot flashes, vaginal discharge, fluid retention, nausea, menstrual irregularities, fatigue.', category_id: 'hormonal-therapy', featured: true, active: true, created_at: '', categories: { name: 'Hormonal Therapy', slug: 'hormonal-therapy' }, product_images: [] },
  { id: '6', name: 'Letrozole (Femara) 2.5mg', slug: 'letrozole-femara-25mg', description: 'An oral non-steroidal aromatase inhibitor that lowers estrogen levels in postmenopausal women, thereby slowing or stopping the growth of estrogen-responsive breast tumors.', manufacturer: 'Novartis', price: 9600, stock: 110, dosage: '2.5mg once daily. May be taken with or without meals.', side_effects: 'Hot flashes, joint pain, muscle pain, fatigue, headache, increased cholesterol, night sweats.', category_id: 'hormonal-therapy', featured: false, active: true, created_at: '', categories: { name: 'Hormonal Therapy', slug: 'hormonal-therapy' }, product_images: [] },
  { id: '7', name: 'Chemo-Skin Soothing Recovery Cream', slug: 'chemo-skin-soothing-recovery-cream', description: 'A clinical-strength dermatologist-tested topical formulation specifically for chemotherapy-induced skin dryness, pruritus, and radiation dermatitis. Features colloidal oatmeal, ceramides, and calendula extract.', manufacturer: 'Tatvlife Lab', price: 3360, stock: 200, dosage: 'Apply liberally to affected skin areas 3 to 4 times daily or as needed.', side_effects: 'None reported. Hypoallergenic, steroid-free, and fragrance-free.', category_id: 'supportive-care', featured: true, active: true, created_at: '', categories: { name: 'Supportive Care', slug: 'supportive-care' }, product_images: [] },
  { id: '8', name: 'CBD-Onco Therapeutic Pain Relief Balm', slug: 'cbd-onco-therapeutic-pain-relief-balm', description: 'A premium, high-potency hemp-derived cannabinoid topical balm designed to manage peripheral neuropathy pain and joint stiffness in oncology patients. Fast-acting and nourishing.', manufacturer: 'Tatvlife Lab', price: 5200, stock: 80, dosage: 'Massage a small amount into painful areas (hands, feet, joints) up to 4 times daily.', side_effects: 'Mild localized skin redness if allergic to essential oils.', category_id: 'pain-management', featured: true, active: true, created_at: '', categories: { name: 'Pain Management', slug: 'pain-management' }, product_images: [] },
]

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'dosage' | 'side_effects'>('description')
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('products')
          .select('*, categories(name, slug), product_images(image_url)')
          .eq('slug', slug)
          .single()
        if (data) {
          setProduct(data as Product)
          // Related products
          const { data: rel } = await supabase
            .from('products')
            .select('*, categories(name, slug), product_images(image_url)')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(3)
          if (rel) setRelated(rel as Product[])
        } else {
          // Use static fallback
          const staticProd = STATIC_PRODUCTS.find(p => p.slug === slug)
          if (staticProd) {
            setProduct(staticProd)
            setRelated(STATIC_PRODUCTS.filter(p => p.category_id === staticProd.category_id && p.id !== staticProd.id).slice(0, 3))
          }
        }
      } catch {
        const staticProd = STATIC_PRODUCTS.find(p => p.slug === slug)
        if (staticProd) {
          setProduct(staticProd)
          setRelated(STATIC_PRODUCTS.filter(p => p.category_id === staticProd.category_id && p.id !== staticProd.id).slice(0, 3))
        }
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid var(--beige-200)', borderTopColor: 'var(--green-600)',
              animation: 'spin 0.7s linear infinite', margin: '0 auto 16px'
            }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
          <AlertCircle size={64} color="var(--beige-300)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>This product doesn&apos;t exist or has been removed.</p>
          <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const imgSrc = product.product_images?.[0]?.image_url
    || `https://picsum.photos/seed/${product.slug}/600/600`

  const tabs = [
    { key: 'description', label: 'Description', content: product.description },
    { key: 'dosage', label: 'Dosage & Usage', content: product.dosage },
    { key: 'side_effects', label: 'Side Effects', content: product.side_effects },
  ] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--beige-100)', borderBottom: '1px solid var(--beige-200)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop</Link>
          <span>/</span>
          {product.categories && (
            <>
              <Link href={`/shop?category=${product.categories.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                {product.categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container" style={{ padding: '56px 24px' }}>
        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

          {/* Image Gallery */}
          <div>
            <div style={{
              borderRadius: 28, overflow: 'hidden',
              background: 'var(--beige-100)', aspectRatio: '1',
              border: '1px solid var(--beige-200)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src={imgSrc}
                alt={product.name}
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/600/600` }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Trust badges under image */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
              {[
                { icon: <Shield size={18} color="var(--green-700)" />, label: 'Genuine', sub: 'Verified' },
                { icon: <Truck size={18} color="var(--green-700)" />, label: 'Worldwide', sub: 'Shipping' },
                { icon: <Package size={18} color="var(--green-700)" />, label: 'Discreet', sub: 'Packaging' },
              ].map(b => (
                <div key={b.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: 16, background: 'var(--green-50, #f2faf4)', borderRadius: 16,
                  border: '1px solid var(--green-100)'
                }}>
                  {b.icon}
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-dark)' }}>{b.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category + badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {product.categories && (
                <Link
                  href={`/shop?category=${product.categories.slug}`}
                  className="badge badge-green"
                  style={{ textDecoration: 'none' }}
                >
                  {product.categories.name}
                </Link>
              )}
              {product.featured && (
                <span className="badge badge-amber">⭐ Featured</span>
              )}
              {product.stock < 20 && (
                <span className="badge badge-red">Low Stock</span>
              )}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700, lineHeight: 1.2,
              color: 'var(--text-dark)', marginBottom: 8
            }}>
              {product.name}
            </h1>

            {product.manufacturer && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                by <strong style={{ color: 'var(--text-dark)' }}>{product.manufacturer}</strong>
              </p>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? '#eab308' : 'none'} color={i < 4 ? '#eab308' : '#d1d5db'} />
                ))}
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>4.0 (based on verified orders)</span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              marginBottom: 32, padding: '20px 24px',
              background: 'var(--beige-100)', borderRadius: 16,
              border: '1px solid var(--beige-200)'
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 700, color: 'var(--green-800)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>INR · per unit</span>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ fontSize: 13, color: product.stock > 30 ? 'var(--green-600)' : product.stock > 10 ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                  {product.stock > 30 ? '✓ In Stock' : product.stock > 10 ? `⚡ Only ${product.stock} left` : `⚠️ Low stock`}
                </span>
                <br />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.stock} units available</span>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--beige-300)', borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="qty-btn"
                  style={{ borderRadius: 0, border: 'none', width: 44, height: 44 }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="qty-btn"
                  style={{ borderRadius: 0, border: 'none', width: 44, height: 44 }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={addedToCart ? '' : 'btn-primary'}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 24px', borderRadius: 9999, fontWeight: 700, fontSize: 15,
                  border: 'none', cursor: 'pointer',
                  background: addedToCart ? 'var(--green-500)' : 'var(--green-800)',
                  color: 'white',
                  transition: 'all 0.3s ease',
                }}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={18} /> Added to Cart!</>
                ) : (
                  <><ShoppingBag size={18} /> Add to Cart — ₹{(product.price * qty).toLocaleString('en-IN')}</>
                )}
              </button>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => product && addItem(product, qty)}
              className="btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 24, textDecoration: 'none' }}
            >
              Buy Now →
            </Link>

            {/* Key features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px', background: 'var(--beige-100)', borderRadius: 16 }}>
              {[
                'Genuine manufacturer-sourced medicine',
                'Secure crypto payment accepted',
                'Worldwide discreet shipping',
                'Full batch traceability certificate',
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="var(--green-500)" style={{ flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabbed Info Section */}
        <div style={{ marginTop: 72 }}>
          <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--beige-200)', marginBottom: 32 }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '14px 24px', background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 15,
                  color: activeTab === t.key ? 'var(--green-800)' : 'var(--text-muted)',
                  borderBottom: `3px solid ${activeTab === t.key ? 'var(--green-600)' : 'transparent'}`,
                  marginBottom: -2, transition: 'all 0.2s'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="card" style={{ padding: 36, maxWidth: 720 }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-muted)' }}>
              {tabs.find(t => t.key === activeTab)?.content || 'Information not available.'}
            </p>
            {activeTab === 'side_effects' && (
              <div style={{
                marginTop: 20, padding: '16px 20px',
                background: '#fef9c3', border: '1px solid #fde68a',
                borderRadius: 12, fontSize: 13, color: '#854d0e'
              }}>
                ⚠️ <strong>Consult your oncologist</strong> before starting or changing any medication. Side effects vary by individual.
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700 }}>Related Products</h2>
              <Link href="/shop" style={{ color: 'var(--green-600)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {related.map(rel => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="product-card"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="product-image-wrap" style={{ aspectRatio: '1' }}>
                    <img
                      src={`https://picsum.photos/seed/${rel.slug}/300/300`}
                      alt={rel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-dark)', marginBottom: 6 }}>{rel.name}</h3>
                    <span className="price-tag" style={{ fontSize: 18 }}>₹{rel.price.toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @media(max-width:768px){
          .product-detail-grid{grid-template-columns:1fr !important; gap: 32px !important;}
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
