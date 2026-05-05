// scripts/fix-images.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update all products with broken image URLs
  const result = await prisma.product.updateMany({
    where: {
      imageUrl: {
        contains: 'images.unplsh.com',  // find the typo
      },
    },
    data: {
      imageUrl: {
        replace: {
          search: 'images.unplsh.com',
          replacement: 'images.unsplash.com',
        },
      },
    },
  });

  console.log(`✅ Updated ${result.count} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());