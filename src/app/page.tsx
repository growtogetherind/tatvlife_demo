'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight, ShieldCheck, Truck, CreditCard, HeartPulse,
  CheckCircle2, ChevronDown, ChevronUp, Star, FlaskConical,
  Microscope, Pill, Activity, Dna, Stethoscope, Package
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const categories = [
  { icon: <Pill size={24} />, name: 'Chemotherapy', slug: 'chemotherapy', desc: 'Oral & IV chemotherapy agents', badge: 'Prescription' },
  { icon: <Activity size={24} />, name: 'Immunotherapy', slug: 'immunotherapy', desc: 'Immune checkpoint inhibitors', badge: 'Specialty Care' },
  { icon: <Microscope size={24} />, name: 'Targeted Therapy', slug: 'targeted-therapy', desc: 'Precision kinase inhibitors', badge: 'Precision' },
  { icon: <Dna size={24} />, name: 'Hormonal Therapy', slug: 'hormonal-therapy', desc: 'Hormone receptor modulators', badge: 'Hormone Care' },
  { icon: <HeartPulse size={24} />, name: 'Supportive Care', slug: 'supportive-care', desc: 'Side-effect management & support', badge: 'Over-the-Counter' },
  { icon: <Stethoscope size={24} />, name: 'Pain Management', slug: 'pain-management', desc: 'Neuropathy & pain relief treatments', badge: 'Supportive' },
]

const steps = [
  { n: '01', title: 'Browse & Upload', desc: 'Select your prescribed oncology medicines and securely upload your prescription documentation.' },
  { n: '02', title: 'Verify & Confirm', desc: 'Our licensed medical partner and pharmacists review your details to verify authenticity.' },
  { n: '03', title: 'Pay with Crypto', desc: 'Complete payments via secure cryptocurrency links. We support BTC, ETH, USDT, and USDC.' },
  { n: '04', title: 'Insured Delivery', desc: 'Medication is shipped in temperature-controlled, discreet, unbranded packaging.' },
]

const faqs = [
  { q: 'Are the medicines on Tatvlife genuine?', a: 'Yes. Every medication is sourced from licensed manufacturers with full batch traceability and WHO-certified compliance. We enforce strict verification to ensure that every patient receives authentic, life-saving medication.' },
  { q: 'How does the crypto payment process work?', a: 'Once your prescription and order details are verified, you will receive a secure crypto checkout link. You can pay directly from your wallet using Bitcoin (BTC), Ethereum (ETH), USDT, or USDC. Once confirmed on-chain, your order is instantly processed.' },
  { q: 'Do you ship worldwide?', a: 'Yes. We deliver to over 150 countries. All shipments are fully insured and shipped via global priority express carriers with active tracking numbers.' },
  { q: 'How are the medicines packaged?', a: 'All items are shipped in discreet, sturdy, temperature-regulated, unbranded packaging with no medication names listed on the exterior to preserve your absolute privacy.' },
  { q: 'Do I need a doctor prescription?', a: 'For prescription oncology medicines, yes. You must upload a valid medical prescription from your oncologist during the checkout process. Supportive care items do not require a prescription.' },
  { q: 'What is your refund policy if delivery is delayed?', a: 'If your order is damaged, incorrect, or lost in transit, we offer a full refund or immediate replacement dispatch. Contact our patient care team to initiate your claim.' }
]

const testimonials = [
  { name: 'Sarah M.', location: 'Toronto, Canada', rating: 5, text: 'Sourcing specialized oncology medicines was incredibly stressful. Tatvlife made the process smooth. Excellent customer support, genuine products, and discreet shipping.' },
  { name: 'Dr. Raj P.', location: 'London, UK', rating: 5, text: 'I recommend Tatvlife to patients who require access to supportive care and medications that are difficult to procure locally. Their verification process is extremely rigorous.' },
  { name: 'Maria K.', location: 'Sydney, Australia', rating: 5, text: 'The crypto payment process was fast and private. The medication arrived perfectly preserved in insulated packaging. Having this service is a lifesaver.' },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />

      {/* ─── HERO SECTION ──────────────────────────────── */}
      <section className="hero-section" style={{ padding: '80px 0', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span className="badge badge-green">🌿 Licensed & Verified</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Oncology E-Commerce</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(40px, 4.5vw, 60px)',
              fontWeight: 500,
              lineHeight: 1.15,
              color: 'var(--green-900)',
              letterSpacing: '-0.02em',
              marginBottom: 24
            }}>
              Breakthrough oncology care,<br />
              made affordable.
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: 'var(--text-muted)', 
              lineHeight: 1.6, 
              marginBottom: 36, 
              maxWidth: 480 
            }}>
              Get your premium oncology medications and supportive care items delivered fast. Prescribed online with secure crypto checkouts and discreet shipping.
            </p>
            
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/shop" className="btn-primary btn-lg">
                Get started
              </Link>
              <Link href="/about" className="btn-outline btn-lg">
                Learn more
              </Link>
            </div>

            {/* Quick stats / trust items */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, borderTop: '1px solid var(--beige-200)', paddingTop: 32 }}>
              {[
                { icon: <ShieldCheck size={18} color="var(--green-700)" />, label: '100% Genuine Guarantee' },
                { icon: <Truck size={18} color="var(--green-700)" />, label: 'Temperature-Regulated' },
                { icon: <CreditCard size={18} color="var(--green-700)" />, label: 'Encrypted Crypto Checkout' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)' }}>
                  {item.icon}
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Block */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', 
              maxWidth: 500,
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'var(--beige-100)',
              border: '1px solid var(--beige-200)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <Image
                src="/hero.png"
                alt="Premium oncology care items"
                width={500}
                height={500}
                style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }}
                priority
              />
            </div>
            {/* Elegant Floating Badge */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: -12,
              background: 'var(--white)',
              border: '1px solid var(--beige-200)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: 'var(--shadow-md)',
              maxWidth: '240px'
            }}>
              <span style={{ fontSize: '24px' }}>🔒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--green-900)' }}>Traceable Supply</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>WHO-certified partners only</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            .hero-section > .container { grid-template-columns: 1fr !important; gap: 32px !important; }
            .hero-section > .container > div:last-child { margin-top: 24px; }
          }
        `}</style>
      </section>

      {/* ─── CATEGORIES SECTION ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(32px, 4vw, 44px)', 
              fontWeight: 500, 
              color: 'var(--green-900)',
              marginBottom: 16 
            }}>
              Personalized healthcare for you.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              Select from our comprehensive list of verified chemotherapy therapies, immunotherapies, and pain management treatments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: 'var(--beige-100)', 
                  border: '1px solid var(--beige-200)',
                  borderRadius: '20px',
                  padding: '32px',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  color: 'inherit'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '12px', 
                    background: 'var(--green-100)', 
                    color: 'var(--green-800)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {cat.icon}
                  </div>
                  <span className="badge badge-green" style={{ textTransform: 'none', fontSize: '11px', background: 'var(--cream)', border: '1px solid var(--beige-200)' }}>
                    {cat.badge}
                  </span>
                </div>
                <h3 style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontWeight: 500, 
                  fontSize: '20px', 
                  color: 'var(--green-900)', 
                  marginBottom: 8 
                }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: 24 }}>{cat.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green-800)', fontWeight: 600, fontSize: '14px' }}>
                  Shop Category <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITION SECTION ──────────────────── */}
      <section className="section" style={{ background: 'var(--beige-100)', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--green-700)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>
              Our Care Model
            </span>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(32px, 4vw, 48px)', 
              fontWeight: 500, 
              color: 'var(--green-900)', 
              lineHeight: 1.15,
              marginBottom: 24 
            }}>
              We bring<br />healthcare home
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: 32 }}>
              Managing cancer treatment is demanding. Tatvlife simplifies sourcing critical medications, delivering them with extreme safety, confidentiality, and reliability.
            </p>
            <Link href="/about" className="btn-primary">
              Learn our values
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                title: 'Care from the comfort of your home, 100% online.',
                desc: 'No waiting rooms, pharmacy lines, or stress. Securely consult with licensed providers and process orders directly from your account.'
              },
              {
                title: 'Secure cryptocurrency transactions.',
                desc: 'Fast checkout methods protecting your data. Complete orders on-chain using Bitcoin, Ethereum, USDT, or USDC, verified in real-time.'
              },
              {
                title: 'Get treatment in days.',
                desc: 'Enjoy rapid dispatch and express delivery from nationwide pharmacies. All therapeutics arrive in specialized, secure thermal boxes.'
              }
            ].map((prop, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 20 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: 'var(--green-800)', 
                  color: 'var(--cream)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '14px', 
                  flexShrink: 0 
                }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green-900)', marginBottom: 8 }}>{prop.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            .section > .container { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(32px, 4vw, 44px)', 
              fontWeight: 500, 
              color: 'var(--green-900)',
              marginBottom: 16 
            }}>
              How Tatvlife works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              We have optimized the logistics and medical approval flow into four simple steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ 
                background: 'var(--beige-100)', 
                border: '1px solid var(--beige-200)',
                borderRadius: '16px', 
                padding: '32px 24px', 
                textAlign: 'center' 
              }}>
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  background: 'var(--green-800)', 
                  color: 'var(--cream)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px', 
                  fontSize: '18px', 
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)'
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--green-900)', marginBottom: 12 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ──────────────────────── */}
      <section className="section" style={{ background: 'var(--beige-100)', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(32px, 4vw, 44px)', 
              fontWeight: 500, 
              color: 'var(--green-900)',
              marginBottom: 16
            }}>
              Trusted by over 2.4 million subscribers*
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              *Consolidated network and community reviews for our pharmacy partnerships.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map((t, idx) => (
              <div key={idx} style={{ 
                background: 'var(--cream)', 
                border: '1px solid var(--beige-200)',
                borderRadius: '20px', 
                padding: '32px' 
              }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--green-700)" color="var(--green-700)" />
                  ))}
                </div>
                <p style={{ color: 'var(--text-dark)', fontSize: '15px', lineHeight: 1.6, marginBottom: 24, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--green-100)', color: 'var(--green-800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px'
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQS SECTION ──────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)', borderBottom: '1px solid var(--beige-200)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(32px, 4vw, 44px)', 
              fontWeight: 500, 
              color: 'var(--green-900)' 
            }}>
              Frequently asked questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ 
                  background: 'var(--beige-100)',
                  border: '1px solid var(--beige-200)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '24px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left', 
                    gap: 16
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--green-900)' }}>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} color="var(--green-700)" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ 
                    padding: '0 24px 24px', 
                    color: 'var(--text-muted)', 
                    fontSize: '15px', 
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--beige-200)',
                    paddingTop: '20px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ───────────────────────────── */}
      <section style={{
        background: 'var(--green-800)',
        padding: '96px 0', 
        textAlign: 'center',
        borderBottom: '1px solid var(--green-900)'
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 5vw, 54px)',
            fontWeight: 500, 
            color: 'var(--cream)', 
            marginBottom: 20, 
            lineHeight: 1.15
          }}>
            Total care. Totally different.
          </h2>
          <p style={{ 
            color: 'var(--green-100)', 
            fontSize: '18px', 
            marginBottom: 40, 
            maxWidth: '520px', 
            margin: '0 auto 40px' 
          }}>
            Experience modern, private, and secure healthcare. Get access to verified oncology medications delivered right to your door.
          </p>
          <Link
            href="/shop"
            className="btn-primary btn-lg"
            style={{
              background: 'var(--cream)',
              color: 'var(--green-800)',
              boxShadow: 'var(--shadow-md)',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--white)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--cream)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Get started
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
