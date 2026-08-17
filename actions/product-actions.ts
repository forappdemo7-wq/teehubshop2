// actions/product-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ─── Helper: Check Admin ──────────────────────────────────────────────
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

// ─── Helper: Generate unique slug ──────────────────────────────────────
async function generateUniqueSlug(baseName: string): Promise<string> {
  let slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  // Ensure uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
}

// ─── CREATE PRODUCT ────────────────────────────────────────────────────
export async function createProduct(formData: FormData) {
  try {
    await checkAdmin();

    // 1. Extract fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryName = formData.get('category') as string; // e.g., "Jersey"
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const images = formData.get('images') as string | null;
    const features = formData.get('features') as string | null;
    const specs = formData.get('specs') as string | null;

    // 2. Validate
    if (!name || !description || isNaN(price) || !categoryName || isNaN(stock) || !imageUrl) {
      return { success: false, error: 'All required fields must be filled' };
    }

    // 3. Find category by name
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return { success: false, error: `Category "${categoryName}" not found` };
    }

    // 4. Generate unique slug
    const slug = await generateUniqueSlug(name);

    // 5. Create product
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        imageUrl,
        images: images && images !== '[]' ? images : null,
        features: features && features !== '[]' ? features : null,
        specs: specs && specs !== '[]' ? specs : null,
        categoryId: category.id,
        isActive: true,
        isFeatured: false,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

// ─── UPDATE PRODUCT ────────────────────────────────────────────────────
export async function updateProduct(formData: FormData) {
  try {
    await checkAdmin();

    // 1. Extract fields
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryName = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const images = formData.get('images') as string | null;
    const features = formData.get('features') as string | null;
    const specs = formData.get('specs') as string | null;

    // 2. Validate
    if (!id || !name || !description || isNaN(price) || !categoryName || isNaN(stock) || !imageUrl) {
      return { success: false, error: 'All required fields must be filled' };
    }

    // 3. Find category by name
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return { success: false, error: `Category "${categoryName}" not found` };
    }

    // 4. Generate new slug if name changed (or keep existing)
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    let slug = existingProduct?.slug;
    if (existingProduct && existingProduct.name !== name) {
      // Name changed – generate a new slug
      slug = await generateUniqueSlug(name);
    } else if (!slug) {
      // Fallback: generate slug if missing (shouldn't happen)
      slug = await generateUniqueSlug(name);
    }

    // 5. Update product
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug, // update slug if name changed
        description,
        price,
        stock,
        imageUrl,
        images: images && images !== '[]' ? images : null,
        features: features && features !== '[]' ? features : null,
        specs: specs && specs !== '[]' ? specs : null,
        categoryId: category.id,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

// ─── DELETE PRODUCT ────────────────────────────────────────────────────
export async function deleteProduct(productId: string) {
  try {
    await checkAdmin();

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}