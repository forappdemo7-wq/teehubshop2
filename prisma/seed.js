// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Category Data ──────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Jersey', slug: 'jerseys', description: 'Official match jerseys and replicas' },
  { name: 'Pants', slug: 'pants', description: 'Training pants and casual wear' },
  { name: 'Shorts', slug: 'shorts', description: 'Performance shorts for training and matches' },
  { name: 'Set', slug: 'sets', description: 'Complete kit sets with jersey, shorts, and socks' },
];

// ─── Product Data ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Elite Football Jersey - Home',
    slug: 'elite-football-jersey-home',
    description: 'High-performance breathable fabric, moisture-wicking technology. Perfect for match day.',
    price: 49.99,
    categorySlug: 'jerseys',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=500',
    features: JSON.stringify(['Breathable mesh fabric', 'Moisture-wicking technology', 'Reinforced stitching']),
    specs: JSON.stringify(['100% Polyester', 'Machine washable', 'Official match fit']),
    isFeatured: true, // ✅ Mark as featured
  },
  {
    name: 'Pro Training Pants',
    slug: 'pro-training-pants',
    description: 'Comfortable tapered fit with zippered pockets. Ideal for training sessions.',
    price: 39.99,
    categorySlug: 'pants',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    features: JSON.stringify(['Tapered fit', 'Zippered pockets', 'Elastic waistband']),
    specs: JSON.stringify(['80% Cotton, 20% Polyester', 'Machine washable', 'Relaxed fit']),
  },
  {
    name: 'Compression Shorts',
    slug: 'compression-shorts',
    description: '2-in-1 design with phone pocket. Anti-chafe and breathable.',
    price: 24.99,
    categorySlug: 'shorts',
    stock: 100,
    imageUrl: 'https://images.pexels.com/photos/8941581/pexels-photo-8941581.jpeg',
    features: JSON.stringify(['2-in-1 design', 'Phone pocket', 'Anti-chafe technology']),
    specs: JSON.stringify(['82% Polyester, 18% Spandex', 'Machine washable', 'Compression fit']),
  },
  {
    name: 'Complete Match Set',
    slug: 'complete-match-set',
    description: 'Includes jersey, shorts, and socks. Premium quality for serious players.',
    price: 89.99,
    categorySlug: 'sets',
    stock: 20,
    imageUrl: 'https://images.pexels.com/photos/26066193/pexels-photo-26066193.jpeg',
    features: JSON.stringify(['Full kit', 'Premium quality', 'Match-ready design']),
    specs: JSON.stringify(['Jersey + Shorts + Socks', '100% Polyester', 'Official match quality']),
  },
  {
    name: 'Retro Edition Jersey',
    slug: 'retro-edition-jersey',
    description: 'Classic design with modern fabric. A tribute to football heritage.',
    price: 59.99,
    categorySlug: 'jerseys',
    stock: 15,
    imageUrl: 'https://images.pexels.com/photos/38812401/pexels-photo-38812401.jpeg',
    features: JSON.stringify(['Retro design', 'Modern fabric', 'Heritage tribute']),
    specs: JSON.stringify(['100% Polyester', 'Machine washable', 'Classic fit']),
  },
  {
    name: 'Cargo Pants - Sideline',
    slug: 'cargo-pants-sideline',
    description: 'Multiple pockets, relaxed fit. Perfect for coaches and fans.',
    price: 44.99,
    categorySlug: 'pants',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    features: JSON.stringify(['Multiple pockets', 'Relaxed fit', 'Durable fabric']),
    specs: JSON.stringify(['60% Cotton, 40% Polyester', 'Machine washable', 'Relaxed fit']),
  },
];

// ─── Logo Data ──────────────────────────────────────────────────────────
const LOGOS = [
  { name: 'CSK', imageUrl: 'https://img.icons8.com/color/96/chennai-super-kings.png', order: 1, showName: true },
  { name: 'MI', imageUrl: 'https://img.icons8.com/color/96/mumbai-indians.png', order: 2, showName: true },
  { name: 'RCB', imageUrl: 'https://img.icons8.com/color/96/royal-challengers-bangalore.png', order: 3, showName: true },
  { name: 'KKR', imageUrl: 'https://img.icons8.com/color/96/kolkata-knight-riders.png', order: 4, showName: true },
  { name: 'DC', imageUrl: 'https://img.icons8.com/color/96/delhi-capitals.png', order: 5, showName: true },
  { name: 'PBKS', imageUrl: 'https://img.icons8.com/color/96/punjab-kings.png', order: 6, showName: true },
  { name: 'RR', imageUrl: 'https://img.icons8.com/color/96/rajasthan-royals.png', order: 7, showName: true },
  { name: 'SRH', imageUrl: 'https://img.icons8.com/color/96/sunrisers-hyderabad.png', order: 8, showName: true },
  { name: 'GT', imageUrl: 'https://img.icons8.com/color/96/gujarat-titans.png', order: 9, showName: true },
  { name: 'LSG', imageUrl: 'https://img.icons8.com/color/96/lucknow-super-giants.png', order: 10, showName: true },
];

// ─── Main Seed Function ──────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting database seed...');

  // ── 1. Create Admin User ──
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@teehubshop.com' },
    update: {},
    create: {
      email: 'admin@teehubshop.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin',
    },
  });
  console.log(`✅ Admin user: ${admin.email} (${admin.role})`);

  // ── 2. Create or Update Categories ──
  console.log('📂 Creating categories...');
  const categoryMap = {};
  for (const catData of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: catData,
    });
    categoryMap[catData.slug] = category.id;
    console.log(`  ✅ ${category.name} (slug: ${category.slug})`);
  }

  // ── 3. Clear existing products and logos ──
  await prisma.product.deleteMany({});
  await prisma.logo.deleteMany({});
  console.log('🗑️ Cleared existing products and logos');

  // ── 4. Create Products ──
  console.log('📦 Creating products...');
  for (const productData of PRODUCTS) {
    const categoryId = categoryMap[productData.categorySlug];
    if (!categoryId) {
      console.error(`❌ Category not found: ${productData.categorySlug}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        imageUrl: productData.imageUrl,
        images: productData.images || null,
        features: productData.features || null,
        specs: productData.specs || null,
        categoryId: categoryId,
        isActive: true,
        isFeatured: productData.isFeatured || false, // ✅ Use explicit flag if provided
      },
    });
    console.log(`  ✅ ${productData.name}`);
  }

  // ── 5. Create Logos ──
  console.log('🔄 Creating team logos...');
  for (const logoData of LOGOS) {
    await prisma.logo.create({
      data: {
        name: logoData.name,
        imageUrl: logoData.imageUrl,
        order: logoData.order,
        isActive: true,
        showName: logoData.showName ?? true, // ✅ New field
      },
    });
    console.log(`  ✅ ${logoData.name}`);
  }

  console.log('✅ Database seed completed successfully!');
  console.log('📝 Admin credentials: admin@teehubshop.com / admin123');
}

// ─── Run Seed ──────────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });