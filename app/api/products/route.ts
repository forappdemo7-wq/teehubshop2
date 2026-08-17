// app/api/products/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Simple slugify function (you can use a library like `slugify` if preferred)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// ─── GET ──────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    const where: any = {};
    if (category && category.toLowerCase() !== 'all') {
      // Filter by category name (relation)
      where.category = { name: category };
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// ─── POST ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // 1. Authenticate – only admins can create products
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const categoryName = formData.get('category') as string; // e.g., "Jersey"
    const imageUrl = formData.get('imageUrl') as string;
    const images = formData.get('images') as string || '[]';
    const features = formData.get('features') as string || '[]';
    const specs = formData.get('specs') as string || '[]';

    // 3. Validation
    if (!name || !description || isNaN(price) || !categoryName || isNaN(stock) || !imageUrl) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // 4. Find the category by name (case‑sensitive; adjust if needed)
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json(
        { error: `Category "${categoryName}" not found` },
        { status: 400 }
      );
    }

    // 5. Generate a unique slug
    let slug = slugify(name);
    // Ensure uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // 6. Create the product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageUrl,
        images,
        features,
        specs,
        categoryId: category.id,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}