import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.resolve(process.cwd(), 'supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Initializing schema in database (creating tables, triggers, policies)...');
    // Execute the schema SQL
    await client.query(schemaSql);
    console.log('Schema initialized successfully!');

    // Insert categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Chemotherapy', slug: 'chemotherapy' },
      { name: 'Immunotherapy', slug: 'immunotherapy' },
      { name: 'Targeted Therapy', slug: 'targeted-therapy' },
      { name: 'Hormonal Therapy', slug: 'hormonal-therapy' },
      { name: 'Supportive Care', slug: 'supportive-care' },
      { name: 'Pain Management', slug: 'pain-management' }
    ];

    const categoryMap = {};

    for (const cat of categories) {
      const res = await client.query(
        `INSERT INTO public.categories (name, slug) 
         VALUES ($1, $2) 
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [cat.name, cat.slug]
      );
      categoryMap[cat.slug] = res.rows[0].id;
      console.log(`Category seeded: ${cat.name} (${res.rows[0].id})`);
    }

    // Insert products
    console.log('Seeding products...');
    const products = [
      {
        name: 'Temozolomide (Temodar) 100mg',
        slug: 'temozolomide-temodar-100mg',
        description: 'An alkylating chemotherapy agent used for the treatment of newly diagnosed glioblastoma multiforme and refractory anaplastic astrocytoma. Provided in oral capsule form for convenient home administration.',
        manufacturer: 'Merck & Co.',
        price: 299.00,
        stock: 50,
        dosage: '150mg/m² or as directed by oncologist. Take once daily on an empty stomach at bedtime.',
        side_effects: 'Nausea, vomiting, headache, fatigue, anorexia, thrombocytopenia, leukopenia.',
        category_slug: 'chemotherapy',
        featured: true,
        image_url: '/assets/products/temodar.webp'
      },
      {
        name: 'Capecitabine (Xeloda) 500mg',
        slug: 'capecitabine-xeloda-500mg',
        description: 'An orally-administered chemotherapy agent that is enzymatically converted to 5-fluorouracil in the tumor. Commonly prescribed for colorectal, gastric, and breast cancers.',
        manufacturer: 'Genentech',
        price: 349.00,
        stock: 40,
        dosage: '1250mg/m² twice daily for 14 days, followed by a 7-day rest period. Take with water within 30 minutes after meals.',
        side_effects: 'Diarrhea, nausea, hand-foot syndrome, vomiting, abdominal pain, fatigue, hyperbilirubinemia.',
        category_slug: 'chemotherapy',
        featured: true,
        image_url: '/assets/products/xeloda.webp'
      },
      {
        name: 'Imatinib (Gleevec) 400mg',
        slug: 'imatinib-gleevec-400mg',
        description: 'A tyrosine kinase inhibitor targeted therapy designed to block the abnormal BCR-ABL protein. Highly effective for Chronic Myelogenous Leukemia (CML) and Gastrointestinal Stromal Tumors (GIST).',
        manufacturer: 'Novartis',
        price: 450.00,
        stock: 30,
        dosage: '400mg daily or as directed. Take with a meal and a large glass of water to minimize gastrointestinal irritation.',
        side_effects: 'Fluid retention, muscle cramps, nausea, diarrhea, skin rash, fatigue, abdominal pain.',
        category_slug: 'targeted-therapy',
        featured: true,
        image_url: '/assets/products/gleevec.webp'
      },
      {
        name: 'Erlotinib (Tarceva) 150mg',
        slug: 'erlotinib-tarceva-150mg',
        description: 'An EGFR inhibitor targeted therapy used for Non-Small Cell Lung Cancer (NSCLC) and pancreatic cancer. Selectively blocks cell signaling pathways that promote tumor growth.',
        manufacturer: 'Astellas / Genentech',
        price: 380.00,
        stock: 25,
        dosage: '150mg once daily. Take on an empty stomach, at least 1 hour before or 2 hours after food.',
        side_effects: 'Diarrhea, acneiform rash, dry skin, fatigue, cough, nausea, breathing difficulty.',
        category_slug: 'targeted-therapy',
        featured: false,
        image_url: '/assets/products/tarceva.webp'
      },
      {
        name: 'Tamoxifen Citrate 20mg',
        slug: 'tamoxifen-citrate-20mg',
        description: 'A selective estrogen receptor modulator (SERM) used for the prevention and treatment of receptor-positive breast cancers. Acts by blocking estrogen stimulation of cancer cells.',
        manufacturer: 'AstraZeneca',
        price: 89.00,
        stock: 150,
        dosage: '20mg once daily in the morning or evening. Can be taken with or without food.',
        side_effects: 'Hot flashes, vaginal discharge, fluid retention, nausea, menstrual irregularities, fatigue.',
        category_slug: 'hormonal-therapy',
        featured: true,
        image_url: '/assets/products/tamoxifen.webp'
      },
      {
        name: 'Letrozole (Femara) 2.5mg',
        slug: 'letrozole-femara-25mg',
        description: 'An oral non-steroidal aromatase inhibitor that lowers estrogen levels in postmenopausal women, thereby slowing or stopping the growth of estrogen-responsive breast tumors.',
        manufacturer: 'Novartis',
        price: 120.00,
        stock: 110,
        dosage: '2.5mg once daily. May be taken with or without meals.',
        side_effects: 'Hot flashes, joint pain, muscle pain, fatigue, headache, increased cholesterol, night sweats.',
        category_slug: 'hormonal-therapy',
        featured: false,
        image_url: '/assets/products/femara.webp'
      },
      {
        name: 'Chemo-Skin Soothing Recovery Cream',
        slug: 'chemo-skin-soothing-recovery-cream',
        description: 'A clinical-strength dermatologist-tested topical formulation specifically for chemotherapy-induced skin dryness, pruritus, and radiation dermatitis. Features colloidal oatmeal, ceramides, and calendula extract.',
        manufacturer: 'Tatvlife Lab',
        price: 42.00,
        stock: 200,
        dosage: 'Apply liberally to affected skin areas 3 to 4 times daily or as needed.',
        side_effects: 'None reported. Hypoallergenic, steroid-free, and fragrance-free.',
        category_slug: 'supportive-care',
        featured: true,
        image_url: '/assets/products/skin_soothing_cream.webp'
      },
      {
        name: 'Onco-Calm Nausea Relief Elixir',
        slug: 'onco-calm-nausea-relief-elixir',
        description: 'A concentrated sublingual blend of botanical adaptogens, gingerols, and peppermint extract. Formulated for rapid absorption to settle the stomach and reduce chemotherapy-induced nausea.',
        manufacturer: 'Tatvlife Lab',
        price: 24.00,
        stock: 300,
        dosage: 'Place 1-2 droppers under the tongue at the onset of nausea symptoms.',
        side_effects: 'Mild warming sensation in mouth.',
        category_slug: 'supportive-care',
        featured: true,
        image_url: '/assets/products/onco_calm_tea.webp'
      },
      {
        name: 'CBD-Onco Therapeutic Pain Relief Balm',
        slug: 'cbd-onco-therapeutic-pain-relief-balm',
        description: 'A premium, high-potency hemp-derived cannabinoid topical balm designed to manage peripheral neuropathy pain and joint stiffness in oncology patients. Fast-acting and nourishing.',
        manufacturer: 'Tatvlife Lab',
        price: 65.00,
        stock: 80,
        dosage: 'Massage a small amount into painful areas (hands, feet, joints) up to 4 times daily.',
        side_effects: 'Mild localized skin redness if allergic to essential oils.',
        category_slug: 'pain-management',
        featured: true,
        image_url: '/assets/products/pain_relief_balm.webp'
      }
    ];

    for (const prod of products) {
      const catId = categoryMap[prod.category_slug];
      
      const prodRes = await client.query(
        `INSERT INTO public.products (name, slug, description, manufacturer, price, stock, dosage, side_effects, category_id, featured, active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         ON CONFLICT (slug) DO UPDATE SET 
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           dosage = EXCLUDED.dosage,
           side_effects = EXCLUDED.side_effects,
           category_id = EXCLUDED.category_id,
           featured = EXCLUDED.featured
         RETURNING id`,
        [prod.name, prod.slug, prod.description, prod.manufacturer, prod.price, prod.stock, prod.dosage, prod.side_effects, catId, prod.featured, prod.active]
      );
      
      const prodId = prodRes.rows[0].id;
      
      // Insert main product image
      await client.query(
        `INSERT INTO public.product_images (product_id, image_url) 
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [prodId, prod.image_url]
      );
      
      console.log(`Product seeded: ${prod.name} (${prodId})`);
    }

    // Seed an admin user record in profiles (using a mock UUID matching the admin user)
    // Wait, the auth trigger will automatically handle signups, but we can pre-create a mock profile 
    // or set a default admin check for demo purposes.
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
