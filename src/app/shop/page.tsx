'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, ChevronDown, ShoppingBag, Star, ArrowRight, SlidersHorizontal } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types'
import { useCart } from '@/context/CartContext'

// Fallback static data for when Supabase keys are not yet configured (in INR)
const STATIC_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Temozolomide (Temodar) 100mg', slug: 'temozolomide-temodar-100mg',
    description: 'An alkylating chemotherapy agent used for glioblastoma multiforme treatment.', manufacturer: 'Merck & Co.',
    price: 23920, stock: 50, dosage: '150mg/m² once daily on empty stomach', side_effects: 'Nausea, vomiting, fatigue, thrombocytopenia',
    category_id: 'chemotherapy', featured: true, active: true, created_at: '',
    categories: { name: 'Chemotherapy', slug: 'chemotherapy' }, product_images: []
  },
  {
    id: '2', name: 'Capecitabine (Xeloda) 500mg', slug: 'capecitabine-xeloda-500mg',
    description: 'Oral chemotherapy agent commonly prescribed for colorectal and breast cancers.', manufacturer: 'Genentech',
    price: 27920, stock: 40, dosage: '1250mg/m² twice daily for 14 days', side_effects: 'Diarrhea, nausea, hand-foot syndrome',
    category_id: 'chemotherapy', featured: true, active: true, created_at: '',
    categories: { name: 'Chemotherapy', slug: 'chemotherapy' }, product_images: []
  },
  {
    id: '3', name: 'Imatinib (Gleevec) 400mg', slug: 'imatinib-gleevec-400mg',
    description: 'Tyrosine kinase inhibitor for CML and GIST treatment.', manufacturer: 'Novartis',
    price: 36000, stock: 30, dosage: '400mg daily with meal', side_effects: 'Fluid retention, muscle cramps, nausea',
    category_id: 'targeted-therapy', featured: true, active: true, created_at: '',
    categories: { name: 'Targeted Therapy', slug: 'targeted-therapy' }, product_images: []
  },
  {
    id: '4', name: 'Tamoxifen Citrate 20mg', slug: 'tamoxifen-citrate-20mg',
    description: 'SERM used for prevention and treatment of receptor-positive breast cancers.', manufacturer: 'AstraZeneca',
    price: 7120, stock: 150, dosage: '20mg once daily', side_effects: 'Hot flashes, vaginal discharge, fluid retention',
    category_id: 'hormonal-therapy', featured: true, active: true, created_at: '',
    categories: { name: 'Hormonal Therapy', slug: 'hormonal-therapy' }, product_images: []
  },
  {
    id: '5', name: 'Letrozole (Femara) 2.5mg', slug: 'letrozole-femara-25mg',
    description: 'Aromatase inhibitor for postmenopausal breast cancer treatment.', manufacturer: 'Novartis',
    price: 9600, stock: 110, dosage: '2.5mg once daily', side_effects: 'Hot flashes, joint pain, fatigue',
    category_id: 'hormonal-therapy', featured: false, active: true, created_at: '',
    categories: { name: 'Hormonal Therapy', slug: 'hormonal-therapy' }, product_images: []
  },
  {
    id: '6', name: 'Erlotinib (Tarceva) 150mg', slug: 'erlotinib-tarceva-150mg',
    description: 'EGFR inhibitor for NSCLC and pancreatic cancer.', manufacturer: 'Astellas',
    price: 30400, stock: 25, dosage: '150mg once daily on empty stomach', side_effects: 'Diarrhea, acneiform rash, fatigue',
    category_id: 'targeted-therapy', featured: false, active: true, created_at: '',
    categories: { name: 'Targeted Therapy', slug: 'targeted-therapy' }, product_images: []
  },
  {
    id: '7', name: 'Chemo-Skin Soothing Recovery Cream', slug: 'chemo-skin-soothing-recovery-cream',
    description: 'Clinical-strength topical for chemotherapy-induced skin dryness and radiation dermatitis.', manufacturer: 'Tatvlife Lab',
    price: 3360, stock: 200, dosage: 'Apply 3-4 times daily as needed', side_effects: 'None reported. Hypoallergenic.',
    category_id: 'supportive-care', featured: true, active: true, created_at: '',
    categories: { name: 'Supportive Care', slug: 'supportive-care' }, product_images: []
  },
  {
    id: '8', name: 'CBD-Onco Therapeutic Pain Relief Balm', slug: 'cbd-onco-therapeutic-pain-relief-balm',
    description: 'High-potency hemp cannabinoid topical for peripheral neuropathy and joint pain.', manufacturer: 'Tatvlife Lab',
    price: 5200, stock: 80, dosage: 'Massage into painful areas up to 4 times daily', side_effects: 'Mild localized redness if allergic to essential oils',
    category_id: 'pain-management', featured: true, active: true, created_at: '',
    categories: { name: 'Pain Management', slug: 'pain-management' }, product_images: []
  },
]

const STATIC_CATEGORIES: Category[] = [
  { id: '1', name: 'Chemotherapy', slug: 'chemotherapy' },
  { id: '2', name: 'Immunotherapy', slug: 'immunotherapy' },
  { id: '3', name: 'Targeted Therapy', slug: 'targeted-therapy' },
  { id: '4', name: 'Hormonal Therapy', slug: 'hormonal-therapy' },
  { id: '5', name: 'Supportive Care', slug: 'supportive-care' },
  { id: '6', name: 'Pain Management', slug: 'pain-management' },
]

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const img = product.product_images?.[0]?.image_url
    || `https://picsum.photos/seed/${product.slug}/400/400`

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}>
        <div className="product-image-wrap">
          <img
            src={img}
            alt={product.name}
            onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/400/400` }}
          />
          {product.featured && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--green-800)', color: 'white',
              padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
            }}>
              Featured
            </div>
          )}
          {product.stock < 20 && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: '#ef4444', color: 'white',
              padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
            }}>
              Low Stock
            </div>
          )}
        </div>
        <div style={{ padding: '20px' }}>
          {product.categories && (
            <span className="badge badge-green" style={{ marginBottom: 10, display: 'inline-flex' }}>
              {product.categories.name}
            </span>
          )}
          <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-dark)', marginBottom: 6, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 16,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {product.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} fill={i < 4 ? '#eab308' : 'none'} color={i < 4 ? '#eab308' : '#d1d5db'} />
            ))}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>(4.0)</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 20px 20px 20px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="price-tag">₹{product.price.toLocaleString('en-IN')}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            href={`/product/${product.slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 9999,
              border: '1.5px solid var(--beige-300)',
              color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            Details
          </Link>
          <button
            onClick={() => addItem(product)}
            className="btn-primary btn-sm"
            style={{ gap: 6 }}
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState('featured')
  const [priceMax, setPriceMax] = useState(50000)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data: prods } = await supabase
          .from('products')
          .select('*, categories(name, slug), product_images(image_url)')
          .eq('active', true)
        if (prods && prods.length > 0) setProducts(prods as Product[])

        const { data: cats } = await supabase.from('categories').select('*')
        if (cats && cats.length > 0) setCategories(cats as Category[])
      } catch {
        // use static data
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCat(cat)
  }, [searchParams])

  const filtered = products
    .filter(p => selectedCat === 'all' || p.categories?.slug === selectedCat || p.category_id === selectedCat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    .filter(p => p.price <= priceMax)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Shop Header */}
      <div style={{ background: 'var(--green-900)', padding: '48px 0 40px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Catalog
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
            Shop Oncology Medicines
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, maxWidth: 500 }}>
            Browse our curated catalog of genuine cancer medicines and supportive care products.
          </p>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: '40px 24px' }}>
        {/* Search & Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              className="input"
              style={{ paddingLeft: 44 }}
              placeholder="Search medicines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-outline btn-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div style={{ position: 'relative' }}>
            <select
              className="select"
              style={{ paddingRight: 36, minWidth: 160 }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32 }}>
          {/* Sidebar filters */}
          <div style={{ width: showFilters ? 220 : 0, overflow: 'hidden', transition: 'width 0.3s' }} className="hidden-mobile">
            {showFilters && (
              <div style={{ paddingRight: 24 }}>
                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Category
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={() => setSelectedCat('all')}
                      style={{
                        textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none',
                        background: selectedCat === 'all' ? 'var(--green-100)' : 'transparent',
                        color: selectedCat === 'all' ? 'var(--green-800)' : 'var(--text-muted)',
                        cursor: 'pointer', fontWeight: selectedCat === 'all' ? 700 : 500, fontSize: 14
                      }}
                    >All Categories</button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCat(cat.slug)}
                        style={{
                          textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none',
                          background: selectedCat === cat.slug ? 'var(--green-100)' : 'transparent',
                          color: selectedCat === cat.slug ? 'var(--green-800)' : 'var(--text-muted)',
                          cursor: 'pointer', fontWeight: selectedCat === cat.slug ? 700 : 500, fontSize: 14
                        }}
                      >{cat.name}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12 }}>
                    Max Price: ₹{priceMax.toLocaleString('en-IN')}
                  </h4>
                  <input
                    type="range" min={1000} max={50000} step={1000} value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--green-600)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    <span>₹1,000</span><span>₹50,000</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div>
            {/* Category tabs (mobile-friendly) */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              <button
                onClick={() => setSelectedCat('all')}
                style={{
                  padding: '7px 16px', borderRadius: 9999, border: '1.5px solid',
                  borderColor: selectedCat === 'all' ? 'var(--green-700)' : 'var(--beige-300)',
                  background: selectedCat === 'all' ? 'var(--green-800)' : 'white',
                  color: selectedCat === 'all' ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s'
                }}
              >All</button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.slug)}
                  style={{
                    padding: '7px 16px', borderRadius: 9999, border: '1.5px solid',
                    borderColor: selectedCat === cat.slug ? 'var(--green-700)' : 'var(--beige-300)',
                    background: selectedCat === cat.slug ? 'var(--green-800)' : 'white',
                    color: selectedCat === cat.slug ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s'
                  }}
                >{cat.name}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div className="spinner" style={{ margin: '0 auto', borderTopColor: 'var(--green-500)', borderColor: 'var(--beige-200)' }} />
                <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Loading medicines...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No medicines found for your search.</p>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                  {filtered.length} medicine{filtered.length !== 1 ? 's' : ''} found
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
