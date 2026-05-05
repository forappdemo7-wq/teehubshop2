import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const UpdateProductSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Main image URL is required"),
  images: z.string().optional().default('[]'),
  features: z.string().optional().default('[]'),
  specs: z.string().optional().default('[]'),
});

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });
    }

    const formData = await req.formData();
    const rawData = Object.fromEntries(formData.entries());
    const result = UpdateProductSchema.safeParse(rawData);

    if (!result.success) {
      // ✅ Fix: use `issues` instead of `errors`
      const firstError = result.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...result.data,
        name: result.data.name.trim(),
        description: result.data.description.trim(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      product,
      message: "Product updated successfully" 
    });
  } catch (error) {
    console.error(`[PRODUCT_PUT_ERROR]:`, error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}