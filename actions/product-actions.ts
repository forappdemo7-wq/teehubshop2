'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function createProduct(formData: FormData) {
  try {
    await checkAdmin();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const images = formData.get('images') as string | null;
    const features = formData.get('features') as string | null;
    const specs = formData.get('specs') as string | null;

    if (!name || !description || isNaN(price) || !category || isNaN(stock) || !imageUrl) {
      return { success: false, error: 'All required fields must be filled' };
    }

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
        images: images && images !== '[]' ? images : null,
        features: features && features !== '[]' ? features : null,
        specs: specs && specs !== '[]' ? specs : null,
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

export async function updateProduct(formData: FormData) {
  try {
    await checkAdmin();

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const images = formData.get('images') as string | null;
    const features = formData.get('features') as string | null;
    const specs = formData.get('specs') as string | null;

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
        images: images && images !== '[]' ? images : null,
        features: features && features !== '[]' ? features : null,
        specs: specs && specs !== '[]' ? specs : null,
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