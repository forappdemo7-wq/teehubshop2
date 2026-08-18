// app/api/products/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ─── Helper: Generate unique slug ──────────────────────────────────────
async function generateUniqueSlug(baseName: string, excludeId?: string): Promise<string> {
  let slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  // Check uniqueness, exclude current product if updating
  const existing = await prisma.product.findFirst({
    where: {
      slug,
      id: { not: excludeId },
    },
  });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
}

// ─── GET Single Product ──────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// ─── PUT Update Product ──────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate form data
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

    if (!name || !description || isNaN(price) || !categoryName || isNaN(stock) || !imageUrl) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // 3. Find category by name
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json(
        { error: `Category "${categoryName}" not found` },
        { status: 400 }
      );
    }

    // 4. Generate unique slug (if name changed)
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    let slug = existingProduct?.slug;
    if (existingProduct && existingProduct.name !== name) {
      slug = await generateUniqueSlug(name, id);
    } else if (!slug) {
      slug = await generateUniqueSlug(name, id);
    }

    // 5. Update product
    const product = await prisma.product.update({
      where: { id },
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
        categoryId: category.id, // ✅ Use categoryId, not category
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// ─── DELETE Product ──────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}