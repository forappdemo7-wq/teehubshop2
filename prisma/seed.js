const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Create admin user (upsert works because email is unique)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@teehubshop.com' },
    update: {},
    create: {
      email: 'admin@teehubshop.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Clear existing products and logos (optional, to avoid duplicates)
  await prisma.product.deleteMany({});
  await prisma.logo.deleteMany({});
  console.log('🗑️ Cleared existing products and logos');

  // 3. Sample products
  const products = [
    {
      name: 'Elite Football Jersey - Home',
      description: 'High-performance breathable fabric, moisture-wicking technology. Perfect for match day.',
      price: 49.99,
      category: 'Jersey',
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=500',
    },
    {
      name: 'Pro Training Pants',
      description: 'Comfortable tapered fit with zippered pockets. Ideal for training sessions.',
      price: 39.99,
      category: 'Pants',
      stock: 35,
      imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    },
    {
      name: 'Compression Shorts',
      description: '2-in-1 design with phone pocket. Anti-chafe and breathable.',
      price: 24.99,
      category: 'Shorts',
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1600185365504-6c0d977f5cb9?w=500',
    },
    {
      name: 'Complete Match Set',
      description: 'Includes jersey, shorts, and socks. Premium quality for serious players.',
      price: 89.99,
      category: 'Set',
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c5c33c?w=500',
    },
    {
      name: 'Retro Edition Jersey',
      description: 'Classic design with modern fabric. A tribute to football heritage.',
      price: 59.99,
      category: 'Jersey',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500',
    },
    {
      name: 'Cargo Pants - Sideline',
      description: 'Multiple pockets, relaxed fit. Perfect for coaches and fans.',
      price: 44.99,
      category: 'Pants',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Sample products seeded');

  // 4. Sample logos
  const logos = [
    { name: 'CSK', imageUrl: 'https://img.icons8.com/color/96/chennai-super-kings.png', order: 1, isActive: true },
    { name: 'MI', imageUrl: 'https://img.icons8.com/color/96/mumbai-indians.png', order: 2, isActive: true },
    { name: 'RCB', imageUrl: 'https://img.icons8.com/color/96/royal-challengers-bangalore.png', order: 3, isActive: true },
    { name: 'KKR', imageUrl: 'https://img.icons8.com/color/96/kolkata-knight-riders.png', order: 4, isActive: true },
    { name: 'DC', imageUrl: 'https://img.icons8.com/color/96/delhi-capitals.png', order: 5, isActive: true },
    { name: 'PBKS', imageUrl: 'https://img.icons8.com/color/96/punjab-kings.png', order: 6, isActive: true },
    { name: 'RR', imageUrl: 'https://img.icons8.com/color/96/rajasthan-royals.png', order: 7, isActive: true },
    { name: 'SRH', imageUrl: 'https://img.icons8.com/color/96/sunrisers-hyderabad.png', order: 8, isActive: true },
    { name: 'GT', imageUrl: 'https://img.icons8.com/color/96/gujarat-titans.png', order: 9, isActive: true },
    { name: 'LSG', imageUrl: 'https://img.icons8.com/color/96/lucknow-super-giants.png', order: 10, isActive: true },
  ];

  for (const logo of logos) {
    await prisma.logo.create({ data: logo });
  }
  console.log('✅ Sample logos seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });